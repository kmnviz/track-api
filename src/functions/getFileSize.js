const fs = require('fs');
const path = require('path');

const getFileSize = (filePath) => {
    const stats = fs.statSync(filePath);
    return stats.size;
};

module.exports = getFileSize;