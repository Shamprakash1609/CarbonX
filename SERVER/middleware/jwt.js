const { expressjwt: expjwt } = require('express-jwt');
const { Token } = require('../models/token');

function authJwt() {
    const API = process.env.API_URL;
    return expjwt({
        secret: process.env.ACCESS_TOKEN_SECRET,
        algorithms: ['HS256'],
        isRevoked: isRevoked,
    }).unless({
        path:[
            `${API}/login`,
            `${API}/login/`,

            `${API}/register`,
            `${API}/register/`,

            `${API}/forgot-password`,
            `${API}/forgot-password/`,

            `${API}/verify-otp`,
            `${API}/verify-otp/`,

            `${API}/reset-password`,
            `${API}/reset-password/`,

            `${API}/gemini`,
            `${API}/gemini/`,

            `${API}/profile`,
            `${API}/profile/`,

            `${API}/calculate`,
            `${API}/calculate/`,

            `${API}/emission`,
            `${API}/emission/`,



            
        ],
    });
}

async function isRevoked(req, jwt) {
    console.log("isRevoked function called");
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("No Authorization header or incorrect format");
        return true;
    }

    const accessToken = authHeader.replace('Bearer ', '').trim();
    const token = await Token.findOne({ accessToken });

    if (!token) {
        console.log("Token not found in database");
        return true;
    }

    const adminRouteRegex = /^\/carbonx\/v1\/admin\//i;
    const adminFault = !jwt.payload.isAdmin && adminRouteRegex.test(req.originalUrl);

    return adminFault || !token;
}

module.exports = authJwt;
