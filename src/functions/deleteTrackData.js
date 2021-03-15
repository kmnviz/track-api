const fs = require('fs');

const storagePath = require('@config').storagePath;
const listFileName = 'list.json';

const deleteTrackData = (userId, trackId) => {
    const userDirPath = `${storagePath}/${userId}`;
    const listFilePath = `${userDirPath}/${listFileName}`;
    const listFileContent = JSON.parse(fs.readFileSync(listFilePath).toString('utf8'));

    delete listFileContent[trackId];

    fs.writeFileSync(listFilePath, JSON.stringify(listFileContent));
};

module.exports = deleteTrackData;
