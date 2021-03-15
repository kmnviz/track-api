const path = require('path');

const config = {
    storagePath: path.join(__dirname, `../../${process.env.STORAGE_PATH}`)
};

module.exports = config;