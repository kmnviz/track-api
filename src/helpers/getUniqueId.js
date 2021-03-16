const crypto = require('crypto');

const getUniqueId = (prefix, bytes) => {
    return `${prefix}${crypto.randomBytes(bytes).toString('hex')}`;
};

module.exports = getUniqueId;