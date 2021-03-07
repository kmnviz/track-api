const getTrackData = require('./getTrackData');

const getChunksRanges = (duration, size, seconds) => {
    const ranges = [];
    const secondsResidue = Math.floor(duration % seconds);
    const chunksCount = secondsResidue > 0 ? Math.floor(duration / seconds) + 1 : Math.floor(duration / seconds);
    console.log(secondsResidue);

    // const bytesResidue = size % chunksCount;
    // console.log(size);
    // console.log(size.toString().length);
    // console.log(bytesResidue);

    for (let inc = 0; inc < chunksCount; inc++) {
        const isFirst = inc === 0;
        const isLast = inc === chunksCount - 1;

        const range = {
            // from: isFirst ? 0 : ((inc * 10) + 1),
            // to: !isLast ? ((inc + 1) * 10) : ((inc * 10) + secondsResidue)
        };

        ranges.push(range);
    }

    return ranges;
};

const getTrackChunk = (userId, trackId) => {
    const trackData = getTrackData(userId, trackId);
    const trackMeta = trackData['meta'];
    const durationFormatted = Math.round(Math.floor((trackMeta['duration']) * 100)) / 100;
    const secondsPerChunk = 10;

    const ranges = getChunksRanges(342, trackMeta['size'], secondsPerChunk);

    console.log(ranges);
};

module.exports = getTrackChunk;
