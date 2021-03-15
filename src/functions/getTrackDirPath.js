const path = require('path');
const storagePath = require('@config').storagePath;

const getTrackDirPath = (userId, trackId) => {
    const userDirPath = `${storagePath}/${userId}`;
    return `${userDirPath}/${trackId}`;
};

module.exports = getTrackDirPath;