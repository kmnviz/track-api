const extractChunkRanges = (second, chunks) => {
    for (let i = 0; i < chunks.length; i++) {
        const rangeArr = chunks[i]['seconds'].split('-');
        if (second >= parseInt(rangeArr[0]) && second <= parseInt(rangeArr[1])) {
            return chunks[i];
        }
    }
    return {};
};

module.exports = extractChunkRanges;