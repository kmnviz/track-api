const fs = require('fs');
const path = require('path');
const { getAudioDurationInSeconds } = require('get-audio-duration');

const getFileSize = require('./getFileSize');
const storagePath = path.join(__dirname, `../../storage`);
const listFileName = 'list.json';

const createTrackMeta = (userId, trackId) => {
    const userDirPath = `${storagePath}/${userId}`;
    const listFilePath = `${userDirPath}/${listFileName}`;
    const listFileContent = JSON.parse(fs.readFileSync(listFilePath).toString('utf8'));
    const trackObject = listFileContent[trackId];
    const trackFilePath = `${userDirPath}/${trackId}/${trackObject['public']}`;
    const trackFileSize = getFileSize(trackFilePath);

    getAudioDurationInSeconds(trackFilePath)
        .then((duration) => {
            trackObject['meta'] = {
                size: trackFileSize,
                duration: Math.floor(duration)
            };

            listFileContent[trackId] = trackObject;
            fs.writeFileSync(listFilePath, JSON.stringify(listFileContent));
        });
};

module.exports = createTrackMeta;