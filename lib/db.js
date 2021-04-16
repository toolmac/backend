const sqlite3 = require('sqlite3');

module.exports.rawAll = function (statement, params) {
    return new Promise((resolve, reject) => {
        let db = new sqlite3.Database('./data/data.db', sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                console.error(err.message);
                reject('Error occurred');
                return;
            }
        });
        db.all(statement, params, (err, rows) => {
            if (err) {
                console.error(err.message);
                reject('Error occurred');
                return;
            }
            else {
                db.close((err) => {
                    if (err) {
                        console.error(err.message);
                        reject('Error occurred');
                        return;
                    }
                    else {
                        resolve(rows);
                        return;
                    }
                })
            }
        })
    });
}

module.exports.rawGet = function (statement, params) {
    return new Promise((resolve, reject) => {
        let db = new sqlite3.Database('./data/data.db', sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                console.error(err.message);
                reject(`Error occurred on ${statement}`);
                return;
            }
        });
        db.get(statement, params, (err, row) => {
            if (err) {
                console.error(err.message);
                reject(`Error occurred on ${statement}`);
                return;
            }
            else {
                db.close((err) => {
                    if (err) {
                        console.error(err.message);
                        reject(`Error occurred on ${statement}`);
                        return;
                    }
                    else {
                        resolve(row);
                        return;
                    }
                })
            }
        })
    });
}

module.exports.rawRun = function (statement, params) {
    return new Promise((resolve, reject) => {
        let db = new sqlite3.Database('./data/data.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
                reject(`Error occurred on ${statement}`);
                return;
            }
        });
        db.run(statement, params, (err) => {
            if (err) {
                console.error(err.message);
                reject(`Error occurred on ${statement}`);
                return;
            }
            else {
                db.close((err) => {
                    if (err) {
                        console.error(err.message);
                        reject(`Error occurred on ${statement}`);
                        return;
                    }
                    else {
                        resolve();
                        return;
                    }
                })
            }
        })
    });
}