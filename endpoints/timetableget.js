const sql = require('../lib/db');
const helper = require('../lib/helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports.name = "timetable/get";
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
                    return res.status(403).json("Unauthorized");
                }
                else {
                    sql.rawGet(`SELECT * FROM timetables WHERE id = ?`, [user.id]).then(row => {
                        if (row) {
                            res.status(200).send(row.json);
                        }
                        else {
                            res.status(404).json('Not found');
                        }
                    }).catch(err => res.status(500).json('Error'));
                }
            });
        }
        else {
            res.status(401).json('Missing auth header');
        }
    } else {
        res.status(401).json('Missing auth header');
    }
}