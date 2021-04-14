const sql = require('../lib/db');
const helper = require('../lib/helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports.name = "user/logout";
module.exports.verify = function (req, res) {
    return true;
}

module.exports.execute = function (req, res) {
    const refeshAuth = req.body.token;
    if (authHeader) {
        jwt.verify(refeshAuth, config.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json('Unauthorized');
            }
            else {
                sql.rawRun(`DELETE FROM refresh WHERE token = "${refeshAuth}"`).then(() => {
                    res.status(200).json('Logout success');
                }).catch(err => res.status(500).json('Error'));
            }
        });
    }
    else {
        res.status(401).json('Bad request');
    }
}