const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ strict: true }));
app.enable('trust proxy');

var endpoints = {}
fs.readdirSync('./endpoints/').forEach(function (file) {
    let m = require('./endpoints/' + file);
    if (m.name == null || m.execute == null || m.verify == null) {
        console.error(`\x1b[31mInvalid endpoint: ${file}\x1b[0m`);
    }
    else if (m.name in endpoints) {
        console.error(`\x1b[31mDuplicate endpoint name: ${file} (${m.name})\x1b[0m`);
    }
    else {
        endpoints[m.name] = m;
        console.log(`Loaded endpoint: ${file} (${m.name})`);
    }
});

app.use('/', function (req, res) {
    const endpoint = req.url.split('?')[0].slice(1);
    if (!endpoints[endpoint]) {
        res.status(404).json('Could not find endpoint');
    }
    else if (endpoints[endpoint].verify(req, res)) {
        try {
            endpoints[endpoint].execute(req, res);
        }
        catch {
            res.sendStatus(500).end();
        }
    }
    else {
        res.status(403).json('Not allowed');
    }
})

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

/*
announcements/get
profile/edit
profile/get
timetable/get
timetable/edit
calendar/get
calendar/edit

user/login
user/register
user/verify
user/logout
*/