const sql = require('../lib/db');
const helper = require('../lib/helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports.name = "announcements/get";
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
                    let query = "SELECT * FROM announcements "
                    let toadd = "";
                    if (req.body.id) {
                        toadd += `id = "${req.body.id}" `;
                    }
                    if (req.body.before && !isNaN(parseInt(req.body.before))) {
                        toadd += `timestamp <= ${parseInt(req.body.before)} `;
                    }
                    if (req.body.after && !isNaN(parseInt(req.body.after))) {
                        toadd += `timestamp >= ${parseInt(req.body.after)} `;
                    }
                    if (toadd !== "") {
                        query += `WHERE ${toadd}`;
                    }
                    query += `ORDER BY timestamp DESC`;
                    if (req.body.amount && isNaN(parseInt(req.body.amount)) && parseInt(req.body.amount) >= 1) {
                        query += `LIMIT ${parseInt(req.body.amount)} `;
                    }
                    else {
                        query += `LIMIT 10 `;
                    }
                    sql.rawAll(query).then((rows) => {
                        res.json(rows);
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