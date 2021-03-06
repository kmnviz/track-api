const uniqueId = require('./uniqueId');

const createFileName = (fileName, fileExt = '') => {
    const fileNameParts = fileName.split('.');
    const fileExtension = fileExt === '' ? fileNameParts[fileNameParts.length - 1] : fileExt;

    return uniqueId('', 8) + '.' + fileExtension;
};

module.exports = createFileName;