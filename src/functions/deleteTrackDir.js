const fs = require('fs');
const path = require('path');
const storagePath = path.join(__dirname, `../../storage`);

const deleteTrackDir = (userId, trackId) => {
    const userDirPath = `${storagePath}/${userId}`;
    const trackDirPath = `${userDirPath}/${trackId}`;

    if (fs.existsSync(trackDirPath)) {
        fs.rmdirSync(trackDirPath, { recursive: true });
    }

    return trackDirPath;
};

module.exports = deleteTrackDir;