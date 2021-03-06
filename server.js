const path = require('path');
const express = require('express');
const app = express();
const port = 3030;

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.json({ message: 'hello', route: '/' });
});

app.post('/create/:user_id', (req, res) => {
    const getUniqueId = require('./src/functions/getUniqueId');
    const userId = `u-${req['params']['user_id']}`;
    const trackId = getUniqueId('t-', 8);
    const createTrackDir = require('./src/functions/createTrackDir');
    const trackDirPath = createTrackDir(userId, trackId);
    const storageCreate = require('./src/services/storage').create(trackDirPath);

    storageCreate(req, res, (err) => {
        if (!err) {
            const createTrackData = require('./src/functions/createTrackData');
            createTrackData(userId, trackId, req['body']);
            const createTrackMp3 = require('./src/functions/createTrackMp3');
            createTrackMp3(userId, trackId);
            const createTrackMeta = require('./src/functions/createTrackMeta');
            createTrackMeta(userId, trackId, req.files.audio);

            res.json({ message: 'done', id: trackId });
        } else {
            res.status(400).json({ message: 'bad request' });
        }
    });
});

app.post('/update/:user_id/:track_id', (req, res) => {
    const userId = `u-${req['params']['user_id']}`;
    const trackId = `${req['params']['track_id']}`;
    const getTrackDirPath = require('./src/functions/getTrackDirPath');
    const trackDirPath = getTrackDirPath(userId, trackId);
    const storageUpdate = require('./src/services/storage').update(trackDirPath);

    storageUpdate(req, res, (err) => {
        if (!err) {
            const updateTrackData = require('./src/functions/updateTrackData');
            const updatedData = req.files && req.files.image.length > 0
                ? Object.assign(req['body'], { image: req.files.image[0].filename })
                : req['body'];

            updateTrackData(userId, trackId, updatedData);

            res.json({ message: 'done', id: trackId });
        } else {
            res.status(400).json({ message: 'bad request' });
        }
    });
});

app.post('/delete/:user_id/:track_id', (req, res) => {
    const userId = `u-${req['params']['user_id']}`;
    const trackId = `${req['params']['track_id']}`;
    const deleteTrackDir = require('./src/functions/deleteTrackDir');
    const deleteTrackData = require('./src/functions/deleteTrackData');

    deleteTrackDir(userId, trackId);
    deleteTrackData(userId, trackId);

    res.json({ message: 'done', id: trackId });
});

app.get('/read/:user_id/:track_id?', (req, res) => {
    const userId = `u-${req['params']['user_id']}`;
    const trackId = `${req['params']['track_id']}`;
    const getUserData = require('./src/functions/getUserData');
    const getTrackData = require('./src/functions/getTrackData');
    const data = req['params']['track_id'] ? getTrackData(userId, trackId) : getUserData(userId);

    res.json({ message: 'done', id: req['params']['track_id'] ? trackId : req['params']['user_id'], data: data });
});

app.get('/download/:user_id/:track_id', (req, res) => {
    const userId = `u-${req['params']['user_id']}`;
    const trackId = `${req['params']['track_id']}`;
    const getTrackFilePath = require('./src/functions/getTrackFilePath');

    try {
        const trackFilePath = getTrackFilePath(userId, trackId);
        res.download(trackFilePath);
    } catch (error) {
        res.status(400).json({ message: 'bad request' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});