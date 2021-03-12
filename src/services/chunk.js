const getBytesPerSecond = require('../functions/getBytesPerSecond');

RANGE_DURATION = 10;

const createChunksRanges = (duration, size) => {
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

const extractChunkRanges = (second, chunks) => {
    for (let i = 0; i < chunks.length; i++) {
        const rangeArr = chunks[i]['seconds'].split('-');
        if (second >= parseInt(rangeArr[0]) && second <= parseInt(rangeArr[1])) {
            return chunks[i];
        }
    }
    return {};
};

const chunk = (second, fileMeta) => {
    const chunk = {};
    const chunksMeta = createChunksRanges(fileMeta['duration'], fileMeta['size']);
    chunk['ranges'] = extractChunkRanges(second, chunksMeta);

    return chunk;
};

module.exports = chunk;