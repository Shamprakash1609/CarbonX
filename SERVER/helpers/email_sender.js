const { PASSWORD_RESET_SUCCESS_TEMPLATE, RESET_OTP_TEMPLATE, SIGNUP_SUCCESSFULL_TEMPLATE } = require('./email_templates');

exports.sendMail = async (email, subject, body) => {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    // Determine the HTML template to use
    let htmlContent = '';
    if (subject === 'Password Reset Successful') {
        htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE.replace('${name}', body.name);
    } else if (subject === 'Password Reset OTP') {
        htmlContent = RESET_OTP_TEMPLATE.replace('${otp}', body);
    } else if (subject === 'Welcome to CarbonX') {
        htmlContent = SIGNUP_SUCCESSFULL_TEMPLATE.replace('${name}', body.name);
    }

    // Configure email options
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: htmlContent,
    };

    // Send the email
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return reject(error);
            }
            console.log('Email sent:', info.response);
            resolve('Email sent successfully');
        });
    });
};
