const fs = require('fs');
const path = require('path');
const ffmpeg = require('../services/ffmpeg');

const storagePath = path.join(__dirname, `../../storage`);
const listFileName = 'list.json';
const imageFormats = ['jpg', 'jpeg', 'png'];
const audioFormats = ['wav', 'flac'];

module.exports = (userId, trackId, payload) => {
    const userDirPath = `${storagePath}/${userId}`;
    const trackDirPath = `${userDirPath}/${trackId}`;
    const listFilePath = `${userDirPath}/${listFileName}`;
    const trackObject = require('../templates/track')();

    Object.keys(payload).forEach((key) => {
        trackObject[key] = payload[key];
    });

    const trackFiles = fs.readdirSync(trackDirPath);
    trackFiles.forEach((file) => {
        const fileParts = file.split('.');
        const fileExtension = fileParts[fileParts.length - 1];

        if (imageFormats.includes(fileExtension)) {
            trackObject['image'].push(file);
        } else if (audioFormats.includes(fileExtension)) {
            trackObject['audio'].push(file);
        }
    });

    const listFileContent = fs.existsSync(listFilePath) ? JSON.parse(fs.readFileSync(listFilePath).toString('utf8')) : {};
    listFileContent[trackId] = trackObject;
    fs.writeFileSync(listFilePath, JSON.stringify(listFileContent));
};