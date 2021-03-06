const path = require('path');
const multer = require('multer');
const createFileName = require('../functions/createFileName');

const options = (dirPath) => {
    return {
        destination: (req, file, cb) => {
            cb(null, dirPath);
        },
        filename: (req, file, cb) => {
            const fileName = createFileName(file.originalname);
            cb(null, fileName);
        }
    }
};

const send = (options, fields, allowedExtensions) => {
    const fileFilter = (req, file, cb) => {
        const fileExtension = file.originalname.split('.')[file.originalname.split('.').length - 1];

        if (!allowedExtensions.includes(fileExtension)) {
            return cb(new Error('Not allowed file format'));
        }

        cb(null, true);
    };

    const diskStorage = multer.diskStorage(options);
    return multer({ storage: diskStorage, fileFilter }).fields(fields);
}

module.exports = {
    create: (dirPath) => {
        const fields = [
            { name: 'audio', maxCount: 1 },
            { name: 'image', maxCount: 1 }
        ];

        return send(options(dirPath), fields, ['jpeg', 'jpg', 'png', 'wav', 'flac']);
    },

    update: (dirPath) => {
        const fields = [
            { name: 'image', maxCount: 1 }
        ];

        return send(options(dirPath), fields, ['jpeg', 'jpg', 'png']);
    }
}