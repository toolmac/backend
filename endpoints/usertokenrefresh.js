const sql = require('../lib/db');
const helper = require('../lib/helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports.name = "user/tokenrefresh";
module.exports.verify = function (req, res) {
    return true;
}

module.exports.execute = function (req, res) {
    const refeshAuth = req.body.token;
    if (refeshAuth) {
        jwt.verify(refeshAuth, config.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json('Invalid');
            }
            else {
                const accessToken = jwt.sign(user, config.TOKEN_SECRET, { expiresIn: '20m' });
                res.json({
                    accessToken
                });
            }
        });
    }
    else {
        res.status(401).json('No refresh token in body');
    }
}