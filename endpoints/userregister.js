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
    if (req.body.password && req.body.username && req.body.firstname && req.body.lastname && req.body.email) {
        let password = req.body.password.trim();
        let email = req.body.email.trim();
        let firstname = req.body.firstname.trim();
        let lastname = req.body.lastname.trim();
        let username = req.body.username.trim();
        if (!helper.validateEmail(email)) {
            res.status(400).send('Invalid email').end();
        }
        else if (!helper.validatePassword(password)) {
            res.status(400).send('Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character').end();
        }
        else if (firstname == "" || lastname == "" || username == "") {
            res.status(400).send('Empty fields').end();
        }
        else {
            sql.rawGet(`SELECT * FROM users WHERE email = "${email}" OR username = "${username}"`).then(row => {
                if (row) {
                    res.status(400).send('Username or email is in use').end();
                }
                else {
                    let id = nanoid.nanoid();
                    bcrypt.hash(password, 10, function (err, hash) {
                        if (err) {
                            res.status(500).end();
                        }
                        else {
                            sql.rawRun(`INSERT INTO users(username, email, password, id, firstname, lastname) VALUES("${username}", "${email}", "${hash}", "${id}", "${firstname}", "${lastname}")`).then(() => {
                                //confirmation email goes here, when implemented
                                res.status(200).send(id).end();
                            }).catch(err => res.status(500).end());
                        }
                    })
                }
            }).catch(err => res.status(500).end());
        }
    }
    else {
        res.status(400).end();
    }
}