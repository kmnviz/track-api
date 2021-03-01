const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const storagePath = path.join(__dirname, `/storage`);
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

const createTrackBody = (listFilePath, trackId, body) => {
    const listFileContent = JSON.parse(fs.readFileSync(listFilePath).toString('utf8'));
    listFileContent[trackId] = body;
    fs.writeFileSync(listFilePath, JSON.stringify(listFileContent));
};
const savePropertyToList = (listFilePath, trackId, key, value) => {
    const listFileContent = JSON.parse(fs.readFileSync(listFilePath).toString('utf8'));
    listFileContent[trackId][key] = value;
    fs.writeFileSync(listFilePath, JSON.stringify(listFileContent));
}

const convertToMp3File = (trackDirPath, fileName) => {
    const convert = ffmpeg(`${trackDirPath}/${fileName}`).format('mp3');
    const newFileName = createFileName(fileName, 'mp3');
    const newFilePath = `${trackDirPath}/${newFileName}`;

    convert.clone().save(newFilePath);

    return newFileName;
};

const storageOptions = (userId, trackId) => {
    const userDirName = `u-${userId}`;
    const userDirPath = `${storagePath}/${userDirName}`;
    const listFilePath = `${userDirPath}/${listFileName}`;
    const trackDirName = `${trackId}`;
    const trackDirPath = `${userDirPath}/${trackDirName}`;

    return {
        destination: (req, file, cb) => {
            createUserDir(userDirPath);
            createListFile(listFilePath);
            createTrackDir(trackDirPath);
            if (file.fieldname === 'audio') {
                createTrackBody(listFilePath, trackId, req.body);
            }

            // Write files to track directory
            cb(null, trackDirPath);
        },
        filename: (req, file, cb) => {
            const fileName = createFileName(file.originalname);
            const fileExtension = getFileExtension(file.originalname);

            cb(null, fileName);

            if (file.fieldname === 'photo') {
                savePropertyToList(listFilePath, trackId, 'cover', fileName);
            } else if (file.fieldname === 'audio') {
                const mp3FileName = convertToMp3File(trackDirPath, fileName);
                savePropertyToList(listFilePath, trackId, fileExtension, fileName);
                savePropertyToList(listFilePath, trackId, 'mp3', mp3FileName);
            }
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

