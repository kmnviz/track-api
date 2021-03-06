const getUniqueId = require('./getUniqueId');

module.exports = (fileName, fileExt = '') => {
    const fileNameParts = fileName.split('.');
    const fileExtension = fileExt === '' ? fileNameParts[fileNameParts.length - 1] : fileExt;

    return getUniqueId('', 8) + '.' + fileExtension;
};