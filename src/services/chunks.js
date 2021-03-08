const build = (duration, size, bps, chunkDuration) => {
    const ranges = {};
    const count = Math.ceil(duration / chunkDuration);
    const length = bps * chunkDuration;

    for (let i = 0; i < count; i++) {
        const first = i === 0;
        const last = i === count - 1;

        let startSecs, endSecs, startBytes, endBytes;

        startSecs = first ? i + 1 : (i * chunkDuration) + 1;
        endSecs = last ? duration : (startSecs + chunkDuration) - 1;

        startBytes = first ? 0 : (length * i);
        endBytes = !last ? (startBytes + length) - 1 : (size - 1);

        ranges[`${startSecs}-${endSecs}`] = `${startBytes}/${endBytes}`;
    }

    return ranges;
}

const chunks = (size, duration) => {
    const bps = Math.floor(size / duration);

    return build(duration, size, bps, 5);
};

module.exports = chunks;