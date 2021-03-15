const fs = require('fs');
const ffmpeg = require('@services/ffmpeg');
const getUniqueId = require('@functions/getUniqueId');

const storagePath = require('@config').storagePath;
const listFileName = 'list.json';

const createTrackMp3 = (userId, trackId) => {
    const listFilePath = `${storagePath}/${userId}/${listFileName}`;
    const trackDirPath = `${storagePath}/${userId}/${trackId}`;
    const listFileContent = JSON.parse(fs.readFileSync(listFilePath).toString('utf8'));
    const audioFilePath = `${storagePath}/${userId}/${trackId}/${listFileContent[trackId]['private']}`;

    const convert = ffmpeg(audioFilePath).format('mp3');
    const newFileName = `${getUniqueId('', 8)}.mp3`;
    const newFilePath = `${trackDirPath}/${newFileName}`;

    listFileContent[trackId]['public'] = newFileName;
    fs.writeFileSync(listFilePath, JSON.stringify(listFileContent));

    return new Promise((resolve, reject) => {
        convert.clone().save(newFilePath)
            .on('end', () => {
                resolve();
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};

module.exports = createTrackMp3;