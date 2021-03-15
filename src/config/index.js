const path = require('path');
const environment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV  ? 'development' : 'production';
const devStoragePath = path.join(__dirname, `../../storage`);

const config = {
    storagePath: environment === 'development' ? devStoragePath : process.env.STORAGE_PATH
};

module.exports = config;