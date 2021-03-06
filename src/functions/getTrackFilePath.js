const fs = require('fs');
const path = require('path');

const storagePath = path.join(__dirname, `../../storage`);
const listFileName = 'list.json';

const getTrackFilePath = (userId, trackId, fileType) => {
    const userDirPath = `${storagePath}/${userId}`;
    if (!fs.existsSync(userDirPath)) {
        throw new Error('No such user.');
    }

    const trackDirPath = `${userDirPath}/${trackId}`;
    const listFilePath = `${userDirPath}/${listFileName}`;
    const listFileContent = JSON.parse(fs.readFileSync(listFilePath).toString('utf8'));
    if (!(trackId in listFileContent)) {
        throw new Error('No such track.');
    }

    return `${trackDirPath}/${listFileContent[trackId][fileType]}`;
};

module.exports = getTrackFilePath;