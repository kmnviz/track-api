const getChunkRanges = require('./getChunkRanges');
const extractChunkRanges = require('./extractChunkRanges');

const getChunk = (second, fileMeta) => {
    const chunk = {};
    const chunkRanges = getChunkRanges(fileMeta['duration'], fileMeta['size']);
    chunk['ranges'] = extractChunkRanges(second, chunkRanges);

    return chunk;
};

module.exports = getChunk;