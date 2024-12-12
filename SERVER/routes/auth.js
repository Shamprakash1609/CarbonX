const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {body} = require('express-validator');

const validateUser = [
    body('name').not().isEmpty().withMessage('Name is Required'),
    body('email').isEmail().withMessage('Please Enter a valid email address'),
    body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    .withMessage('Password must contain at least one uppercase, one lowercase, one number, and one symbol.'),
    body('phone').isMobilePhone().withMessage('Please enter a valid phone')

];

const validatePassword = [
    body('newPassword')
    .isLength({min : 8})
    .withMessage('Password must be atleast 8 characters')
    .isStrongPassword()
    .withMessage('Password must contain alteast one uppercase, one lowercase , and one symbol.'),
];

router.post('/login' , authController.login);

router.post('/register' , validateUser ,authController.register);

router.get('/verify-token' , authController.verifyToken);

router.post('/forgot-password' ,authController.forgotPassword);

router.post('/verify-otp' ,authController.verifyPasswordResetOpt);

router.post('/reset-password' , validatePassword ,authController.resetPassword);

module.exports = router;