const fs = require('fs');
const path = require('path');

const storagePath = path.join(__dirname, `../../storage`);
const listFileName = 'list.json';

const getTrackData = (userId, trackId) => {
    const userDirPath = `${storagePath}/${userId}`;
    const listFilePath = `${userDirPath}/${listFileName}`;
    const listFileContent = JSON.parse(fs.readFileSync(listFilePath).toString('utf8'));

    return listFileContent[trackId];
};

module.exports = getTrackData;
