const getBytesPerSecond = (size, duration) => {
    return Math.floor(size / duration);
};

module.exports = getBytesPerSecond;