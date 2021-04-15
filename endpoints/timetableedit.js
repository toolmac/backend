const sql = require('../lib/db');
const helper = require('../lib/helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports.name = "timetable/edit";
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
                    if (req.body.timetable) {
                        if (/^[\],:{}\s]*$/.test(req.body.timetable.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                            sql.rawGet(`SELECT * FROM timetables WHERE id = "${user.id}"`).then(row => {
                                if (row) {
                                    sql.runWithParams(`UPDATE timetables SET json = ? WHERE id = ?`, [req.body.timetable, user.id]).then(() => {
                                        res.status(200).json("Updated successfully");
                                    }).catch(err => res.status(500).json('Error'));
                                }
                                else {
                                    sql.runWithParams(`INSERT INTO timetables (id, json) VALUES(?, ?)`, [user.id, req.body.timetable]).then(() => {
                                        res.status(200).json("Inserted successfully");
                                    }).catch(err => res.status(500).json('Error'));
                                }
                            }).catch(err => res.status(500).json('Error'));
                        } else {
                            res.status(400).json("Bad JSON");
                        }
                    }
                    else {
                        res.status(400).json("Where timetable?");
                    }
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