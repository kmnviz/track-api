const crypto = require('crypto');

module.exports = (prefix, bytes) => {
    return `${prefix}${crypto.randomBytes(bytes).toString('hex')}`;
};