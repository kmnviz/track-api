const multer = require('multer');
const uniqueId = require('./uniqueId');

const createFileName = (fileName, fileExt = '') => {
    const fileNameParts = fileName.split('.');
    const fileExtension = fileExt === '' ? fileNameParts[fileNameParts.length - 1] : fileExt;

    return uniqueId('', 8) + '.' + fileExtension;
};

const storageOptions = (trackDirPath) => {
    return {
        destination: (req, file, cb) => {
            cb(null, trackDirPath);
        },
        filename: (req, file, cb) => {
            const fileName = createFileName(file.originalname);
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
        { name: 'image', maxCount: 1 }
    ]);
};

