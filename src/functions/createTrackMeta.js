const fs = require('fs');
const path = require('path');
const { getAudioDurationInSeconds } = require('get-audio-duration');

const storagePath = path.join(__dirname, `../../storage`);
const listFileName = 'list.json';

const createTrackMeta = (userId, trackId, audio) => {
    const fileName = audio[0].filename;
    const fileSize = audio[0].size;
    const userDirPath = `${storagePath}/${userId}`;
    const listFilePath = `${userDirPath}/${listFileName}`;
    const trackFilePath = `${userDirPath}/${trackId}/${fileName}`;
    const listFileContent = JSON.parse(fs.readFileSync(listFilePath).toString('utf8'));
    const trackObject = listFileContent[trackId];

    const meta = {
        size: fileSize
    };

    getAudioDurationInSeconds(trackFilePath)
        .then((duration) => {
            meta['duration'] = duration;
            trackObject['meta'] = meta;
            listFileContent[trackId] = trackObject;
            fs.writeFileSync(listFilePath, JSON.stringify(listFileContent));
        });
};

module.exports = createTrackMeta;