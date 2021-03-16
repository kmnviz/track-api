const prefix = 'test-storage-zvuk';
const storage = require('@services/google/storage');

const bucketOptions = {
    standard: true,
    multiRegional: true,
    location: 'EU'
};

const bucket = (name) => {
    const bucketName = `${prefix}-${name}`;
    const self = storage.bucket(bucketName);

    return {
        create: () => {
            self.exists((err, exists) => {
                if (!exists && !err) {
                    self.create(bucketOptions, (err, bucket, apiResponse) => {
                        if (err) {
                            throw new Error('something went wrong while creating bucket');
                        }

                        return bucketName;
                    });
                } else if (err) {
                    throw new Error('something went wrong while checking of existence');
                } else {
                    throw new Error('bucket already exists');
                }
            });
        }
    };
};

module.exports = bucket;