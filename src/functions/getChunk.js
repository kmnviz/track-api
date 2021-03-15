const getChunkRanges = require('@functions/getChunkRanges');
const extractChunkRanges = require('@functions/extractChunkRanges');

const getChunk = (second, fileMeta) => {
    const chunk = {};
    const chunkRanges = getChunkRanges(fileMeta['duration'], fileMeta['size']);
    chunk['ranges'] = extractChunkRanges(second, chunkRanges);

    return chunk;
};

module.exports = getChunk;