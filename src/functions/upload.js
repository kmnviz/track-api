const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const storagePath = path.join(__dirname, `../../storage`);
const listFileName = 'list.json';

const getFileExtension = (fileName) => {
    const fileNameParts = fileName.split('.');
    return fileNameParts[fileNameParts.length - 1];
};

const createFileName = (fileName, fileExt = '') => {
    const fileNameParts = fileName.split('.');
    const fileExtension = fileExt === '' ? fileNameParts[fileNameParts.length - 1] : fileExt;

    return crypto.randomBytes(8).toString('hex') + '.' + fileExtension;
};

const createUserDir = (userDirPath) => {
    if (!fs.existsSync(userDirPath)) {
        fs.mkdirSync(userDirPath);
    }
};

const createTrackDir = (trackDirPath) => {
    if (!fs.existsSync(trackDirPath)) {
        fs.mkdirSync(trackDirPath);
    }
};

const createListFile = (listFilePath) => {
    if (!fs.existsSync(listFilePath)) {
        fs.writeFileSync(listFilePath, JSON.stringify({}));
    }
};

const convertToMp3File = (trackDirPath, fileName) => {
    const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    const ffmpeg = require('fluent-ffmpeg');
    ffmpeg.setFfmpegPath(ffmpegPath);

    const newFileName = createFileName(fileName, 'mp3');
    const newFilePath = `${trackDirPath}/${newFileName}`;

    ffmpeg(`${trackDirPath}/${fileName}`).toFormat('mp3').saveToFile(newFilePath);

    return newFileName;
};

const fillTrackObject = (object, key, value) => {
    object[key] = value;
    return object;
};

const addTrackToList = (listFilePath, trackId, body) => {
    const listFileContent = JSON.parse(fs.readFileSync(listFilePath).toString('utf8'));
    listFileContent[trackId] = body;
    fs.writeFileSync(listFilePath, JSON.stringify(listFileContent));
};

const storageOptions = (userId, trackId) => {
    const userDirName = `u-${userId}`;
    const userDirPath = `${storagePath}/${userDirName}`;
    const listFilePath = `${userDirPath}/${listFileName}`;
    const trackDirName = `${trackId}`;
    const trackDirPath = `${userDirPath}/${trackDirName}`;
    const trackObject = require('../templates/track');

    return {
        destination: (req, file, cb) => {
            createUserDir(userDirPath);
            createListFile(listFilePath);
            createTrackDir(trackDirPath);
            Object.keys(req.body).forEach((key) => {
                fillTrackObject(trackObject, key, req.body[key]);
            });

            // Write files to track directory
            cb(null, trackDirPath);
        },
        filename: (req, file, cb) => {
            const fileName = createFileName(file.originalname);
            const fileExtension = getFileExtension(file.originalname);

            cb(null, fileName);

            if (file.fieldname === 'photo') {
                fillTrackObject(trackObject, 'cover', fileName);
            } else if (file.fieldname === 'audio') {
                const mp3FileName = convertToMp3File(trackDirPath, fileName);
                fillTrackObject(trackObject, fileExtension, fileName);
                fillTrackObject(trackObject, 'format', fileExtension);
                fillTrackObject(trackObject, 'mp3', mp3FileName);
            }

            addTrackToList(listFilePath, trackId, trackObject);
        }
    }
}

module.exports = (userId, trackId) => {
    const storage = multer.diskStorage(storageOptions(userId, trackId));

    return multer({
        storage : storage
    }).fields([
        { name: 'audio', maxCount: 1 },
        { name: 'photo', maxCount: 1 }
    ]);
};

