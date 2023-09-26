const jwtVariable = require('../variables/jwt');

const authMethod = require('./method');

exports.isAuth = async (req, res, next) => {
    // Lấy access token từ header
    const accessTokenFromHeader = req.headers.x_authorization;
    if (!accessTokenFromHeader) {
        return res.status(401).send('Not found access token!');
    }

    const accessTokenSecret =
        process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

    const verified = await authMethod.verifyToken(
        accessTokenFromHeader,
        accessTokenSecret,
    );
    if (!verified) {
        return res
            .status(401)
            .send('Access denied !!');
    }

    return next();
};