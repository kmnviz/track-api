const fs = require('fs');
const path = require('path');

const storagePath = path.join(__dirname, `../../storage`);
const listFileName = 'list.json';

const deleteTrackData = (userId, trackId) => {
    const userDirPath = `${storagePath}/${userId}`;
    const listFilePath = `${userDirPath}/${listFileName}`;
    const listFileContent = JSON.parse(fs.readFileSync(listFilePath).toString('utf8'));

    delete listFileContent[trackId];

    fs.writeFileSync(listFilePath, JSON.stringify(listFileContent));
};

module.exports = deleteTrackData;
