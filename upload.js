const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const storagePath = path.join(__dirname, `/storage`);
const listFileName = 'list.json';

const createFileName = (fileOriginalName) => {
    const fileOriginalNameParts = fileOriginalName.split('.');
    const fileExtension = fileOriginalNameParts[fileOriginalNameParts.length - 1];

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
}

const saveBodyToList = (listFilePath, trackId, body) => {
    const listFileContent = JSON.parse(fs.readFileSync(listFilePath).toString('utf8'));
    listFileContent[trackId] = body;
    fs.writeFileSync(listFilePath, JSON.stringify(listFileContent));
};

const saveCoverToList = (listFilePath, trackId, fileName) => {
    const listFileContent = JSON.parse(fs.readFileSync(listFilePath).toString('utf8'));
    listFileContent[trackId]['cover'] = fileName;
    fs.writeFileSync(listFilePath, JSON.stringify(listFileContent));
}

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
                saveBodyToList(listFilePath, trackId, req.body);
            }

            // Write files to track directory
            cb(null, trackDirPath);
        },
        filename: (req, file, cb) => {
            const fileName = createFileName(file.originalname);
            if (file.fieldname === 'photo') {
                saveCoverToList(listFilePath, trackId, fileName);
            }

            cb(null, fileName);
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

