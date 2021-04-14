const sql = require('../lib/db');
const helper = require('../lib/helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports.name = "calendar/get";
module.exports.verify = function (req, res) {
    return true;
}

module.exports.execute = function (req, res) {
    //some sort of authentication
    if (req.body.startdate && req.body.days && req.body.startdate.day && req.body.startdate.month && req.body.year) {
        let startD = parseInt(req.body.startdate.day);
        let startM = parseInt(req.body.startdate.month);
        let startY = parseInt(req.body.startdate.year);
        let days = parseInt(req.body.days);
        if (startD && startM && startY && days) {
            if (days > 100) {
                res.status(401).json('Limited to 100 days per request');
            }
            else {
                sql.rawAll(`SELECT * FROM days`, []).then(rows => {
                    sql.rawAll(`SELECT * FROM events`, []).then(events => {
                        let dates = rows;
                        dates.sort(function (a, b) {
                            //assuming DD-MM-YYYY
                            var aa = a.date.split('-').reverse().join(),
                                bb = b.date.split('-').reverse().join();
                            return aa < bb ? -1 : (aa > bb ? 1 : 0);
                        });
                        let result = [];
                        let started = false;
                        let counter = 0;
                        for (let i = 0; i < dates.length; i++) {
                            if ((dates[i].date == `${startD}-${startM}-${startY}` && !started) || started) {
                                let day = dates[i];
                                day.events = events.filter(e => e.date == dates[i].date);
                                result.push(day);
                                started = true;
                                counter++;
                            }
                            if (counter == days) {
                                break;
                            }
                        }
                        res.json(result);
                    }).catch(err => res.status(500).json('Error'));
                }).catch(err => res.status(500).json('Error'));
            }
        }
        else {
            res.status(400).json('Invalid startdate/days');
        }
    }
    else {
        res.status(400).json('No startdate or days specified');
    }
}