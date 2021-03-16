RANGE_DURATION = 10;

class Chunk {
    constructor(fileMeta) {
        this.duration = fileMeta['duration'];
        this.size = fileMeta['size'];
    };

    get bps() {
        return Math.floor(this.size / this.duration);
    };

    get ranges() {
        const chunks = [];
        const count = Math.ceil(this.duration / RANGE_DURATION);
        const length = Math.floor(this.bps * RANGE_DURATION);

        for (let i = 0; i < count; i++) {
            const first = i === 0;
            const last = i === count - 1;

            let startSecs, endSecs, startBytes, endBytes;

            startSecs = first ? 0 : (i * RANGE_DURATION);
            endSecs = last ? this.duration : (startSecs + RANGE_DURATION) - 1;

            if (first) {
                startBytes = 0;
                endBytes = (startBytes + length) - 1;
            } else {
                startBytes = (length * i) - 1;
                endBytes = !last ? (startBytes + length) : (this.size - 1);
            }

            chunks.push({
                seconds: `${startSecs}-${endSecs}`,
                bytes: `${startBytes}/${endBytes}`
            });
        }

        return chunks;
    };

    extract(second) {
        for (let i = 0; i < this.ranges.length; i++) {
            const rangeArr = this.ranges[i]['seconds'].split('-');
            if (second >= parseInt(rangeArr[0]) && second <= parseInt(rangeArr[1])) {
                return this.ranges[i];
            }
        }
        return {};
    };

    one(second) {
        const chunk = {};
        const chunkRanges = this.ranges;
        chunk['ranges'] = this.extract(second, chunkRanges);

        return chunk;
    };
}

module.exports = Chunk;