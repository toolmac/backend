const sql = require('../lib/db');
const helper = require('../lib/helper');
const bcrypt = require('bcrypt');
const nanoid = require('nanoid');

module.exports.name = "user/register";
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
            res.status(400).send('Invalid email').end();
        }
        else if (!helper.validatePassword(password)) {
            res.status(400).send('Invalid password').end();
        }
        else if (email == "" && username == "") {
            res.status(400).send('Empty fields').end();
        }
        else {
            sql.rawGet(`SELECT * FROM users WHERE email = "${email}" OR username = "${username}"`).then(row => {
                if (row) {
                    bcrypt.compare(password, row.password, function(err, result) {
                        if(err) {
                            res.status(500).end();
                        }
                        else if(result) {
                            //authorize access
                        }
                        else {
                            res.status(401).send('Email/username or password is incorrect').end();
                        }
                    });
                }
                else {
                    res.status(401).send('Email/username or password is incorrect').end();
                }
            }).catch(err => res.status(500).end());
        }
    }
    else {
        res.status(400).end();
    }
}