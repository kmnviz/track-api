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

const send = (options, fields) => {
    const diskStorage = multer.diskStorage(options);
    return multer({ storage: diskStorage }).fields(fields);
}

module.exports = {
    create: (dirPath) => {
        const fields = [
            { name: 'audio', maxCount: 1 },
            { name: 'image', maxCount: 1 }
        ];

        return send(options(dirPath), fields);
    },

    update: (dirPath) => {
        const fields = [
            { name: 'image', maxCount: 1 }
        ];

        return send(options(dirPath), fields);
    }
}