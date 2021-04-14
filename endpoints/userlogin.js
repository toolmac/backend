const sql = require('../lib/db');
const helper = require('../lib/helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports.name = "user/login";
module.exports.verify = function (req, res) {
    return true;
}

module.exports.execute = function (req, res) {
    for (const prop in req.body) {
        req.body[prop] = String(req.body[prop]);
    }
    if (req.body.password && (req.body.username || req.body.email)) {
        let password = req.body.password.trim();
        let email = (req.body.email) ? req.body.email.trim() : "";
        let username = (req.body.username) ? req.body.username.trim() : "";
        if (!helper.validateEmail(email)) {
            res.status(400).json('Invalid email');
        }
        else if (!helper.validatePassword(password)) {
            res.status(400).json('Invalid password');
        }
        else if (email == "" && username == "") {
            res.status(400).json('Empty fields');
        }
        else {
            sql.rawGet(`SELECT * FROM users WHERE email = "${email}" OR username = "${username}"`).then(row => {
                if (row) {
                    bcrypt.compare(password, row.password, function (err, result) {
                        if (err) {
                            res.status(500).json('Error');
                        }
                        else if (result) {
                            let obj = row;
                            delete obj.password;
                            delete obj.verified;
                            obj.iat = Date.now();
                            obj.exp = Date.now() + 20 * 60 * 1000;
                            let accessToken = jwt.sign(obj, config.TOKEN_SECRET, { expiresIn: "20m" });
                            let refreshToken = jwt.sign({ id: obj.id }, config.REFRESH_TOKEN_SECRET);
                            sql.rawRun(`INSERT INTO refresh (id, token) VALUES("${obj.id}", "${refreshToken}")`).then(() => {
                                res.json({
                                    accessToken,
                                    refreshToken
                                });
                            }).catch(err => res.status(500).json('Error'));
                        }
                        else {
                            res.status(401).json('Email/username or password is incorrect');
                        }
                    });
                }
                else {
                    res.status(401).json('Email/username or password is incorrect');
                }
            }).catch(err => res.status(500).json('Error'));
        }
    }
    else {
        res.status(400).json('Missing required fields');
    }
}