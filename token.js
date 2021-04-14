const fs = require('fs');

let obj = {
    TOKEN_SECRET: "",
    REFRESH_TOKEN_SECRET: ""
}
require('crypto').randomBytes(48, function (err, buffer) {
    require('crypto').randomBytes(48, function (err, buffer2) {
        obj.TOKEN_SECRET = (buffer.toString('hex'));
        obj.REFRESH_TOKEN_SECRET = (buffer2.toString('hex'));
        let raw = JSON.stringify(obj);
        fs.writeFileSync('./config.json', raw);
    });
});