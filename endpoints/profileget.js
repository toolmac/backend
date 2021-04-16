const sql = require('../lib/db');
const helper = require('../lib/helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports.name = "profile/get";
module.exports.verify = function (req, res) {
    return true;
}

module.exports.execute = function (req, res) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            jwt.verify(token, config.TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res.status(403).json({ status: 403, error: "Invalid or expired JWT token" });
                }
                else {
                    res.status(200).json(user);
                }
            });
        }
        else {
            res.status(401).json({ status: 401, error: "Missing authorization header contents" });
        }
    } else {
        res.status(401).json({ status: 401, error: "Missing authorization header" });
    }
}