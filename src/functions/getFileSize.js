const fs = require('fs');

const getFileSize = (filePath) => {
    const stats = fs.statSync(filePath);
    return stats.size;
};

module.exports = getFileSize;