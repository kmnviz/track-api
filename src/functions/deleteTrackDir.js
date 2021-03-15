const fs = require('fs');
const storagePath = require('@config').storagePath;

const deleteTrackDir = (userId, trackId) => {
    const userDirPath = `${storagePath}/${userId}`;
    const trackDirPath = `${userDirPath}/${trackId}`;

    if (fs.existsSync(trackDirPath)) {
        fs.rmdirSync(trackDirPath, { recursive: true });
    }

    return trackDirPath;
};

module.exports = deleteTrackDir;