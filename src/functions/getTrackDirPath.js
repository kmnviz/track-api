const path = require('path');
const storagePath = path.join(__dirname, `../../storage`);

const getTrackDirPath = (userId, trackId) => {
    const userDirPath = `${storagePath}/${userId}`;
    return `${userDirPath}/${trackId}`;
};

module.exports = getTrackDirPath;