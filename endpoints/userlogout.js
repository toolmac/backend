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
                return res.sendStatus(403);
            }
            else {
                sql.rawRun(`DELETE FROM refresh WHERE token = "${refeshAuth}"`).then(() => {
                    res.status(200).send('Logout success').end();
                }).catch(err => res.status(500).end());
            }
        });
    }
    else {
        res.status(401).end();
    }
}