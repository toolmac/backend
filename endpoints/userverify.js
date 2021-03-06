const sql = require('../lib/db');
const helper = require('../lib/helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports.name = "user/verify";
module.exports.verify = function (req, res) {
    return true;
}

module.exports.execute = function (req, res) {
    /*
    format: 
    {
        "code": "blah"
    }
    */
    if (req.body.code) {
        sql.rawGet(`SELECT * FROM verify WHERE code = ?`, [req.body.code]).then(row => {
            if (row) {
                sql.rawRun(`DELETE FROM verify WHERE code = ?`, [req.body.code]).then(() => {
                    sql.rawRun(`UPDATE users SET verified = 1 WHERE id = ?`, [row.id]).then(() => {
                        res.status(200).json({ message: "You are verified!" });
                    }).catch(err => res.status(500).json({ status: 500, error: "Internal server error" }));
                }).catch(err => res.status(500).json({ status: 500, error: "Internal server error" }));
            }
            else {
                res.status(401).json({ status: 401, error: "Invalid verification code" });
            }
        }).catch(err => res.status(500).json({ status: 500, error: "Internal server error" }));
    }
    else {
        res.status(400).json({ status: 400, error: "Missing code field in request body" });
    }
}