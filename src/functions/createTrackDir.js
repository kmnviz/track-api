const fs = require('fs');
const path = require('path');
const storagePath = path.join(__dirname, `../../storage`);

module.exports = (userId, trackId) => {
    const userDirPath = `${storagePath}/${userId}`;
    const trackDirPath = `${userDirPath}/${trackId}`;

    if (!fs.existsSync(userDirPath)) {
        fs.mkdirSync(userDirPath);
    }

    if (!fs.existsSync(trackDirPath)) {
        fs.mkdirSync(trackDirPath);
    }

    return trackDirPath;
}