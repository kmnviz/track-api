const fs = require('fs');
const storagePath = require('@config').storagePath;

const createTrackDir = (userId, trackId) => {
    const userDirPath = `${storagePath}/${userId}`;
    const trackDirPath = `${userDirPath}/${trackId}`;

    if (!fs.existsSync(userDirPath)) {
        fs.mkdirSync(userDirPath);
    }

    if (!fs.existsSync(trackDirPath)) {
        fs.mkdirSync(trackDirPath);
    }

    return trackDirPath;
};

module.exports = createTrackDir;