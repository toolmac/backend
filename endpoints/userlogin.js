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
        if (!helper.validateEmail(email) && email !== "") {
            res.status(400).json({ status: 400, error: 'Invalid email' });
        }
        else if (!helper.validatePassword(password)) {
            res.status(400).json({ status: 400, error: 'Invalid password' });
        }
        else if (email == "" && username == "") {
            res.status(400).json({ status: 400, error: 'Empty fields' });
        }
        else {
            sql.rawGet(`SELECT * FROM users WHERE email = ? OR username = ?`, [email, username]).then(row => {
                if (row) {
                    bcrypt.compare(password, row.password, function (err, result) {
                        if (err) {
                            res.status(500).json({ status: 500, error: "Internal server error" });
                        }
                        else if (result) {
                            if (row.verified == 1) {
                                let obj = row;
                                delete obj.password;
                                delete obj.verified;
                                let accessToken = jwt.sign(obj, config.TOKEN_SECRET, { expiresIn: "20m" });
                                let refreshToken = jwt.sign({ id: obj.id }, config.REFRESH_TOKEN_SECRET);
                                sql.rawRun(`INSERT INTO refresh (id, token) VALUES(?, ?)`, [obj.id, refreshToken]).then(() => {
                                    res.json({
                                        accessToken,
                                        refreshToken
                                    });
                                }).catch(err => res.status(500).json({ status: 500, error: "Internal server error" }));
                            }
                            else {
                                //on app, go to verification entry page
                                //on website, redirect to verification
                                res.status(401).json({ status: 401, error: "Verification required" });
                            }
                        }
                        else {
                            res.status(401).json({ status: 401, error: 'Email/username or password is incorrect' });
                        }
                    });
                }
                else {
                    res.status(401).json({ status: 401, error: 'Email/username or password is incorrect' });
                }
            }).catch(err => res.status(500).json({ status: 500, error: "Internal server error" }));
        }
    }
    else {
        res.status(400).json({ status: 400, error: 'Missing required fields' });
    }
}