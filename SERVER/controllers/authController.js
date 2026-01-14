const { validationResult } = require('express-validator');
const User = require('../models/user'); 
const { Token } = require('../models/token');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailSender = require('../helpers/email_sender');


exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        const errorMessages = errors.array().map((error) => ({
            field: error.path,
            message: error.msg,
        }));
        return res.status(400).json({ errors: errorMessages });
    }

    try {
        let user = new User({
            ...req.body,
            passwordHash: bcrypt.hashSync(req.body.password, 8),
        });

        user = await user.save();
        console.log("User saved:", user); 

        if (!user) {
            return res.status(500).json({
                type: 'Internal server error',
                message: 'Could not create a new user'
            });
        }

        // Send a welcome email to the user
        const welcomeMessage = await mailSender.sendMail(
            user.email,
            'Welcome to CarbonX',
            { name: user.name } 
        );

        // Respond with success
        return res.status(201).json({
            message: 'User created successfully and welcome email sent!',
            user: user
        });

    } catch (error) {
        console.error(error);
        if (error.message.includes('email_1 dup key')) {
            return res.status(400).json({
                type: 'AuthError',
                message: 'User with that email already exists.',
            });
        }
        return res.status(500).json({ type: error.name, message: error.message });
    }
};


exports.login = async (req, res) => { 
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found\nCheck your email and try again.' });
        }
        
        if (!bcrypt.compareSync(password, user.passwordHash)) {
            return res.status(400).json({
                message: 'Incorrect password!',
            });
        }

        const accessToken = jwt.sign(
            { id: user.id, isAdmin: user.isAdmin },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '24h' },
        );

        const refreshToken = jwt.sign(
            { id: user.id, isAdmin: user.isAdmin },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '60d' },
        );

        const token = await Token.findOne({ userId: user.id });
        if (token) await token.deleteOne();
        await new Token({
            userId: user.id, 
            accessToken, 
            refreshToken,
        }).save();

        // Setting passwordHash to undefined to exclude it from the response
        user.passwordHash = undefined;
        
        // Destructuring the user to include jobRole, mineName, and name
        const { jobRole, mineName, name } = user;

        console.log({ ...user._doc });

        
        return res.json({ ...user._doc, accessToken, jobRole, mineName, name });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            type: error.name, 
            message: error.message,
        });
    }
};


exports.verifyToken = async (req, res) => {
    try {
        let accessToken = req.headers.authorization;
        if (!accessToken) return res.json(false);

        accessToken = accessToken.replace('Bearer', '').trim();
        console.log("Access token:", accessToken);  

        const token = await Token.findOne({ accessToken });
        if (!token) {
            console.log("Token not found");
            return res.json(false);
        }

        console.log("Found token:", token);

        const tokenData = jwt.decode(token.refreshToken);
        if (!tokenData || !tokenData.id) {
            console.log("Invalid or missing token data");
            return res.json(false);
        }

        console.log("Token data:", tokenData);

        const user = await User.findById(tokenData.id);
        if (!user) {
            console.log("User not found");
            return res.json(false);
        }

        const isValid = jwt.verify(token.refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!isValid) {
            console.log("Refresh token verification failed");
            return res.json(false);
        }

        return res.json(true);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            type: error.name,
            message: error.message,
        });
    }
};


exports.forgotPassword = async (req, res) => { 
    try {
        const { email } = req.body;

        // Check if the user exists in the database
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User with that email doesn't exist" });
        }

        // Generate a random OTP (4-digit number)
        const otp = Math.floor(1000 + Math.random() * 9000);

        
        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpires = Date.now() + 600000; // OTP expires in 10 minutes

        
        await user.save();

        
        const response = await mailSender.sendMail(
            email, 
            'Password Reset OTP', 
            `${otp}` 
        );

        // Respond to the client
        return res.json({ message: response });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};


exports.verifyPasswordResetOpt = async (req, res) => { 
    try{
        const { email , otp } = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "User not found!"});
        }
        if(user.resetPasswordOtp !== +otp || Date.now() > user.resetPasswordOtpExpires){
            return res.status(401).json({message: "Invalid or expired OTP"});
        }
        user.resetPasswordOtp = 1;
        user.resetPasswordOtpExpires = undefined;

        await user.save();
        return res.json({message: "OTP confirmed successfully."});

    }catch(error){
        console.error(error);
        return res.status(500).json({ type: error.name , message: error.message });
    }
};


exports.resetPassword = async (req, res) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        const errorMessages = errors.array().map((error) => ({
            field: error.path,
            message: error.msg,
        }));
        return res.status(400).json({ errors: errorMessages });
    }
    
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        if (user.resetPasswordOtp !== 1) {
            return res.status(401).json({ message: 'Confirm OTP before resetting password.' });
        }

        user.passwordHash = bcrypt.hashSync(newPassword, 8);
        user.resetPasswordOtp = undefined; // Clear OTP after successful reset
        await user.save();

        // Send the "Password Reset Successful" email
        const emailBody = { name: user.name }; 
        await mailSender.sendMail(email, 'Password Reset Successful', emailBody);

        
        return res.json({ message: "Password reset successfully and email sent!" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.name, message: error.message });
    }
};



 