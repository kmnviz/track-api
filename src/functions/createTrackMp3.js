const fs = require('fs');
const path = require('path');
const ffmpeg = require('../services/ffmpeg');
const uniqueId = require('./uniqueId');

const storagePath = path.join(__dirname, `../../storage`);
const listFileName = 'list.json';

module.exports = (userId, trackId) => {
    const listFilePath = `${storagePath}/${userId}/${listFileName}`;
    const trackDirPath = `${storagePath}/${userId}/${trackId}`;
    const listFileContent = JSON.parse(fs.readFileSync(listFilePath).toString('utf8'));
    const audioFilePath = `${storagePath}/${userId}/${trackId}/${listFileContent[trackId]['private']}`;

    const convert = ffmpeg(audioFilePath).format('mp3');
    const newFileName = `${uniqueId('', 8)}.mp3`;
    const newFilePath = `${trackDirPath}/${newFileName}`;

    listFileContent[trackId]['public'] = newFileName;
    fs.writeFileSync(listFilePath, JSON.stringify(listFileContent));

    convert.clone().save(newFilePath);
}