const SIGNUP_SUCCESSFULL_TEMPLATE = `
<html>
    <head>
        <style>
            body {
                background-color: #000;
                color: #fff;
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                background-color: #111;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
                box-sizing: border-box;
            }
            h1 {
                color: #f39c12;
                text-align: center;
                font-size: 28px;
                margin-bottom: 20px;
            }
            .welcome-box {
                background-color: #222;
                padding: 20px;
                text-align: center;
                border-radius: 8px;
                margin-top: 20px;
            }
            .welcome-box p {
                font-size: 20px;
                color: #ff9900;
                font-weight: bold;
                margin: 0;
            }
            .footer {
                background-color: #333;
                color: #ddd;
                padding: 10px;
                text-align: center;
                font-size: 12px;
                margin-top: 30px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            .body-text {
                color: #ddd;
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 20px;
                text-align: center;
            }

            /* Responsive Design */
            @media (max-width: 600px) {
                .container {
                    padding: 15px;
                }
                h1 {
                    font-size: 24px;
                }
                .body-text {
                    font-size: 14px;
                }
                .welcome-box p {
                    font-size: 18px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to CarbonX</h1>
            <p class="body-text">Dear ${'${name}'},</p>
            <p class="body-text">Thanks for joining CarbonX! We’re excited to have you on board in our mission to reduce carbon emissions and build a sustainable future. Our platform provides powerful tools for assessing, tracking, and reducing carbon emissions.</p>

            <div class="welcome-box">
                <p>Together, let's make a real impact on climate change!</p>
            </div>

            <p class="body-text">Your contribution is vital. Explore our features to start measuring and reducing your carbon footprint. Our support team is always here to help.</p>

            <div class="footer">
                <p>&copy; 2024 CarbonX. All rights reserved.</p>
            </div>
        </div>
    </body>
</html>

`;

const RESET_OTP_TEMPLATE = `
<html>
    <head>
        <style>
            body {
                background-color: #000;
                color: #fff;
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                background-color: #111;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
                box-sizing: border-box;
            }
            h1 {
                color: #f39c12;
                text-align: center;
                font-size: 28px;
                margin-bottom: 20px;
            }
            .otp-box {
                background-color: #222;
                padding: 20px;
                text-align: center;
                border-radius: 8px;
                margin-top: 20px;
            }
            .otp-box p {
                font-size: 24px;
                color: #ff9900;
                font-weight: bold;
                margin: 0;
            }
            .footer {
                background-color: #333;
                color: #ddd;
                padding: 10px;
                text-align: center;
                font-size: 12px;
                margin-top: 30px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            .btn {
                background-color: #ff9900;
                color: #fff;
                padding: 12px 20px;
                text-align: center;
                display: block;
                width: 100%;
                border: none;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
                margin-top: 20px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
            }
            .btn:hover {
                background-color: #ffa07a;
            }
            .body-text {
                color: #ddd;
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 20px;
                text-align: center;
            }

            /* Responsive Design */
            @media (max-width: 600px) {
                .container {
                    padding: 15px;
                }
                h1 {
                    font-size: 24px;
                }
                .otp-box p {
                    font-size: 20px;
                }
                .body-text {
                    font-size: 14px;
                }
                .btn {
                    font-size: 16px;
                    padding: 12px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>CarbonX</h1>
            <p class="body-text">Dear User,</p>
            <p class="body-text">You have requested a password reset for your CarbonX account. Please use the OTP below to complete your request.</p>

            <div class="otp-box">
                <p>Your OTP: <strong>${'${otp}'}</strong></p>
            </div>

            <p class="body-text">If you did not request a password reset, please ignore this email or contact support.</p>

            <a href="#" class="btn">Reset Password</a>

            <div class="footer">
                <p>&copy; 2024 CarbonX. All rights reserved.</p>
            </div>
        </div>
    </body>
</html>
`;

const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<html>
    <head>
        <style>
            body {
                background-color: #000;
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                color: #fff;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #111;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
                text-align: center;
                overflow: hidden;
            }
            h1 {
                color: #f39c12;
                font-size: 28px;
                margin-bottom: 20px;
            }
            p {
                font-size: 16px;
                color: #ddd;
                line-height: 1.8;
                margin: 10px 0;
            }
            .btn {
                display: inline-block;
                margin-top: 20px;
                padding: 12px 20px;
                background-color: #ff9900;
                color: #fff;
                text-decoration: none;
                font-weight: bold;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
                text-transform: uppercase;
            }
            .btn:hover {
                background-color: #ffa07a;
                color: #111;
            }
            .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #ddd;
                border-top: 1px solid #333;
                padding-top: 15px;
            }
            .logo {
                margin-bottom: 20px;
                font-size: 20px;
                color: #fff;
                text-transform: uppercase;
                font-weight: bold;
                letter-spacing: 2px;
            }
            @media (max-width: 768px) {
                .container {
                    margin: 10px;
                    padding: 20px;
                }
                h1 {
                    font-size: 24px;
                }
                p {
                    font-size: 14px;
                }
                .btn {
                    font-size: 14px;
                    padding: 10px 16px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">CarbonX</div>
            <h1>Password Reset Successful</h1>
            <p>Dear ${'${name}'},</p>
            <p>Your password has been successfully reset. You can now log in with your new password.</p>
            <p>If you did not request this change, please contact our support team immediately.</p>
            <a href="https://www.carbonx.com/login" class="btn">Go to Login</a>
            <div class="footer">
                <p>&copy; 2024 CarbonX. All rights reserved.</p>
            </div>
        </div>
    </body>
</html>
`;




module.exports = { SIGNUP_SUCCESSFULL_TEMPLATE, RESET_OTP_TEMPLATE , PASSWORD_RESET_SUCCESS_TEMPLATE };
