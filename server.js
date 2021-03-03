const path = require('path');
const crypto = require('crypto');
const express = require('express');
const app = express();
const port = 3030;

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.json({ message: 'hello', route: '/' });
});

app.post('/test', (req, res) => {
    res.json({ message: 'hello', route: '/test' });
});

app.post('/upload/:user_id', (req, res) => {
    const uniqueId = require('./src/functions/uniqueId');
    const userId = `u-${req['params']['user_id']}`;
    const trackId = uniqueId('t-', 8);
    const createTrackDir = require('./src/functions/createTrackDir');
    const trackDirPath = createTrackDir(userId, trackId);
    const upload = require('./src/functions/upload')(trackDirPath);

    upload(req, res, (err) => {
        if (!err) {
            const createTrackData = require('./src/functions/createTrackData');
            createTrackData(userId, trackId, req['body']);
        }
    });

    res.json({ message: 'hello', route: '/upload', trackId: trackId });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});