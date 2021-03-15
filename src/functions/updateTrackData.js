const fs = require('fs');

const storagePath = require('@config').storagePath;
const listFileName = 'list.json';
const imageFormats = ['jpg', 'jpeg', 'png'];

const updateTrackData = (userId, trackId, payload) => {
    const userDirPath = `${storagePath}/${userId}`;
    const listFilePath = `${userDirPath}/${listFileName}`;
    const listFileContent = JSON.parse(fs.readFileSync(listFilePath).toString('utf8'));
    const trackObject = listFileContent[trackId];

    Object.keys(payload).forEach((key) => {
        if (key === 'image') {
            const fileParts = payload[key].split('.');
            const fileExtension = fileParts[fileParts.length - 1];
            if (imageFormats.includes(fileExtension)) {
                trackObject[key] = payload[key];
            }
        } else {
            trackObject[key] = payload[key];
        }
    });

    listFileContent[trackId] = trackObject;
    fs.writeFileSync(listFilePath, JSON.stringify(listFileContent));
};

module.exports = updateTrackData;
