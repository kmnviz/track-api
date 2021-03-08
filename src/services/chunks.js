const build = (seconds, bps, remain) => {
    const ranges = {};

    for (let i = 0; i < seconds; i++) {
        const start = i === 0 ? 0 : (i * bps);
        const end = (bps * (i + 1)) - 1;

        ranges[i + 1] = `${start}/${end}`;
    }

    const lastRange = ranges[seconds].split('/');
    ranges[seconds + 1] = (parseInt(lastRange[1]) + 1) + '/' + (parseInt(lastRange[1]) + parseInt(remain));

    return ranges;
}

const chunks = (size, duration) => {
    const seconds = Math.floor(duration);
    const remain = size % seconds;
    const bps = Math.floor(size / seconds);

    return build(seconds, bps, remain);
};

module.exports = chunks;