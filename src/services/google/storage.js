const path = require('path');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    projectId: process.env.GCP_STORAGE_PROJECT_ID,
    keyFile: path.join(__dirname, `../../../${process.env.GOOGLE_APPLICATION_CREDENTIALS}`)
});

module.exports = storage;