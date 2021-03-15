const fs = require('fs');

const storagePath = require('@config').storagePath;
const listFileName = 'list.json';

const getUserData = (userId) => {
    const userDirPath = `${storagePath}/${userId}`;
    const listFilePath = `${userDirPath}/${listFileName}`;

    return JSON.parse(fs.readFileSync(listFilePath).toString('utf8'));
};

module.exports = getUserData;
