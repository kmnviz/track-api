const fs = require('fs');
const path = require('path');

const storagePath = path.join(__dirname, `../../storage`);
const listFileName = 'list.json';

const getUserData = (userId) => {
    const userDirPath = `${storagePath}/${userId}`;
    const listFilePath = `${userDirPath}/${listFileName}`;

    return JSON.parse(fs.readFileSync(listFilePath).toString('utf8'));
};

module.exports = getUserData;
