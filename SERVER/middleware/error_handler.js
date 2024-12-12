const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Token } = require('../models/token');

async function errorHandler(error, req, res, next) {
    if (error.name === "UnauthorizedError") {
        console.log("Unauthorized error:", error.message);
        
        if (!error.message.includes('jwt expired')) {
            return res.status(error.status).json({ type: error.name, message: error.message });
        }

        try {
            const tokenHeader = req.header("Authorization");
            const authToken = tokenHeader?.split(' ')[1];
            const token = await Token.findOne({
                accessToken: authToken,
                refreshToken: { $exists: true },
            });

            if (!token) {
                console.log("No token found with refresh token");
                return res.status(401).json({ type: "Unauthorized", message: "Token doesn't exist." });
            }

            const userData = jwt.verify(token.refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await User.findById(userData.id);

            if (!user) {
                console.log("User not found");
                return res.status(404).json({ message: "Invalid user!" });
            }

            const newAccessToken = jwt.sign(
                { id: user.id, isAdmin: user.isAdmin },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '24h' }
            );

            req.headers['authorization'] = `Bearer ${newAccessToken}`;

            await Token.updateOne(
                { _id: token.id },
                { accessToken: newAccessToken }
            );

            res.set("Authorization", `Bearer ${newAccessToken}`);
            next();

        } catch (refreshError) {
            console.log("Error during token refresh:", refreshError.message);
            return res.status(401).json({ type: "Unauthorized", message: refreshError.message });
        }
    } return res.status(404).json({ type: error.name, message: error.message });
}

module.exports = errorHandler;
