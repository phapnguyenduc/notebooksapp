const TABLE = "user";
const mysql = require('../db_connection');

// Get variable config on EAV file
const dotenv = require('dotenv');
dotenv.config();

const jwtVariable = require('../variables/jwt');

//auth jwt
const authMethod = require('../auth/method');

function getUsers() {
    try {

    } catch (error) {
        console.log(error.message);
    }
}

function createUser(req, res) {
    try {
        console.log(req.body.username);
        const accessTokenLife =
            process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
        const accessTokenSecret =
            process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
        const dataForAccessToken = {
            username: req.body.username,
        };

        authMethod.generateToken(
            dataForAccessToken,
            accessTokenSecret,
            '',
        ).then((accessToken) => {
            var sql = "INSERT INTO user (username, token) VALUES ?";
            var values = [
                [req.body.username, accessToken]
            ];
            mysql.query(sql, [values], function (err, result) {
                if (err) throw err;

                res.send({ token: accessToken });
            });
        });

    } catch (error) {
        res.send(error.message);
    }
}

function deleteUser() {
    try {

    } catch (error) {
        console.log(error.message);
    }
}

function updateUser() {
    try {

    } catch (error) {
        console.log(error.message);
    }
}

function getUserId(token) {
    try {
        var sql = "SELECT u.id FROM user as u WHERE u.token=?";
        var values = [
            [token]
        ];

        return new Promise((resolve, reject) => {
            mysql.query(sql, [values], function (err, result) {
                if (err) reject(new Error(err.message));

                resolve(result[0].id);
            });
        });


    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    getUsers,
    getUserId,
    updateUser,
    deleteUser,
    createUser
}