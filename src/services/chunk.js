// seconds: duration
// bytes: size

RANGE_DURATION = 10;

// bytes per second
const bps = (size, duration) => {
    return size / duration;
};

const createChunks = (duration, size) => {
    const chunks = [];
    const count = Math.ceil(duration / RANGE_DURATION);
    const length = Math.floor(bps(size, duration) * RANGE_DURATION);

    for (let i = 0; i < count; i++) {
        const first = i === 0;
        const last = i === count - 1;

        let startSecs, endSecs, startBytes, endBytes;

        startSecs = first ? i + 1 : (i * RANGE_DURATION) + 1;
        endSecs = last ? duration : (startSecs + RANGE_DURATION) - 1;

        startBytes = first ? 0 : (length * i);
        endBytes = !last ? (startBytes + length) - 1 : (size - 1);

        chunks.push({
            range: `${startSecs}-${endSecs}`,
            length: `${startBytes}/${endBytes}`
        });
    }

    return chunks;
};

const extractChunk = (second, chunks) => {
    for (let i = 0; i < chunks.length; i++) {
        const rangeArr = chunks[i]['range'].split('-');
        if (second >= parseInt(rangeArr[0]) && second <= parseInt(rangeArr[1])) {
            return chunks[i];
        }
    }
    return {};
};

const chunk = (second, fileMeta) => {
    const chunks = createChunks(fileMeta['duration'], fileMeta['size']);
    return extractChunk(second, chunks);
};

module.exports = chunk;