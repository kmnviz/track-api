const getBytesPerSecond = require('../functions/getBytesPerSecond');

RANGE_DURATION = 10;

const getChunkRanges = (duration, size) => {
    const chunks = [];
    const bps = getBytesPerSecond(size, duration);
    const count = Math.ceil(duration / RANGE_DURATION);
    const length = Math.floor(bps * RANGE_DURATION);

    for (let i = 0; i < count; i++) {
        const first = i === 0;
        const last = i === count - 1;

        let startSecs, endSecs, startBytes, endBytes;

        startSecs = first ? 0 : (i * RANGE_DURATION);
        endSecs = last ? duration : (startSecs + RANGE_DURATION) - 1;

        if (first) {
            startBytes = 0;
            endBytes = (startBytes + length) - 1;
        } else {
            startBytes = (length * i) - 1;
            endBytes = !last ? (startBytes + length) : (size - 1);
        }

        chunks.push({
            seconds: `${startSecs}-${endSecs}`,
            bytes: `${startBytes}/${endBytes}`
        });
    }

    return chunks;
};

module.exports = getChunkRanges;