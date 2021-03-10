const fs = require('fs');

const getFileContent = (filePath, bytesStart, bytesEnd) => {
    const length = (bytesEnd - bytesStart) + 1;
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(length);

    fs.readSync(fd, buffer, 0, length, bytesStart);
    fs.closeSync(fd);

    return buffer;
};

module.exports = getFileContent;