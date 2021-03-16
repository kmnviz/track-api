require('dotenv').config();
require('module-alias/register');

const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.json({ message: 'hello', route: '/' });
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/test', (req, res) => {
    const name = req['query']['name'];
    const bucket = require('@services/google/bucket')(name);
    bucket.create();
    res.json({ message: 'hello', route: '/test' });
});

app.post('/create/:user_id', (req, res) => {
    const getUniqueId = require('@helpers/getUniqueId');
    const userId = `u-${req['params']['user_id']}`;
    const trackId = getUniqueId('t-', 8);
    const createTrackDir = require('@functions/createTrackDir');
    const trackDirPath = createTrackDir(userId, trackId);
    const storageCreate = require('@services/storage').create(trackDirPath);

    storageCreate(req, res, (err) => {
        if (!err) {
            const createTrackData = require('@functions/createTrackData');
            createTrackData(userId, trackId, req['body']);
            const createTrackMp3 = require('@functions/createTrackMp3');
            createTrackMp3(userId, trackId)
                .then(() => {
                    const createTrackMeta = require('@functions/createTrackMeta');
                    createTrackMeta(userId, trackId);

                    res.json({ message: 'done', id: trackId });
                })
                .catch(() => {
                    res.status(400).json({ message: 'something went wrong' });
                });
        } else {
            res.status(400).json({ message: 'bad request' });
        }
    });
});

app.post('/update/:user_id/:track_id', (req, res) => {
    const userId = `u-${req['params']['user_id']}`;
    const trackId = `${req['params']['track_id']}`;
    const getTrackDirPath = require('@functions/getTrackDirPath');
    const trackDirPath = getTrackDirPath(userId, trackId);
    const storageUpdate = require('@services/storage').update(trackDirPath);

    storageUpdate(req, res, (err) => {
        if (!err) {
            const updateTrackData = require('@functions/updateTrackData');
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
    const deleteTrackDir = require('@functions/deleteTrackDir');
    const deleteTrackData = require('@functions/deleteTrackData');

    deleteTrackDir(userId, trackId);
    deleteTrackData(userId, trackId);

    res.json({ message: 'done', id: trackId });
});

app.get('/read/:user_id/:track_id?', (req, res) => {
    const userId = `u-${req['params']['user_id']}`;
    const trackId = `${req['params']['track_id']}`;
    const getUserData = require('@functions/getUserData');
    const getTrackData = require('@functions/getTrackData');
    const data = req['params']['track_id'] ? getTrackData(userId, trackId) : getUserData(userId);
    if (req['params']['track_id']) {
        const ranges = new (require('@services/ranges'))(data['meta']);
        data['meta']['ranges'] = ranges.all.length;
    }

    res.json({ message: 'done', id: req['params']['track_id'] ? trackId : req['params']['user_id'], data: data });
});

app.get('/download/:user_id/:track_id', (req, res) => {
    const userId = `u-${req['params']['user_id']}`;
    const trackId = `${req['params']['track_id']}`;
    const getTrackFilePath = require('@functions/getTrackFilePath');

    try {
        const trackFilePath = getTrackFilePath(userId, trackId, 'private');
        res.download(trackFilePath);
    } catch (error) {
        res.status(400).json({ message: 'bad request' });
    }
});

app.get('/content/:user_id/:track_id', (req, res) => {
    const userId = `u-${req['params']['user_id']}`;
    const trackId = `${req['params']['track_id']}`;
    const getTrackFilePath = require('@functions/getTrackFilePath');
    const getTrackData = require('@functions/getTrackData');
    const trackData = getTrackData(userId, trackId);

    try {
        const trackFilePath = getTrackFilePath(userId, trackId, 'public');
        const headers = {
            'Content-Type': 'audio/mpeg',
            'Content-Length': `${trackData['meta']['size']}`,
            'Content-Range': `bytes 0-${trackData['meta']['size']}/${trackData['meta']['size']}`,
            'Content-Disposition': `attachment; filename=${trackData['public']}`,
        };

        res.writeHead(200, headers);
        const readableStream = fs.createReadStream(trackFilePath);
        readableStream.pipe(res);
    } catch (error) {
        res.status(400).json({ message: 'bad request' });
    }
});

app.get('/range/:user_id/:track_id/:second', (req, res) => {
    const userId = `u-${req['params']['user_id']}`;
    const trackId = `${req['params']['track_id']}`;
    const second = `${req['params']['second']}`;
    const trackFilePath = require('@functions/getTrackFilePath')(userId, trackId, 'public');
    const trackData = require('@functions/getTrackData')(userId, trackId);
    const ranges = new (require('@services/ranges'))(trackData['meta']);
    const range = ranges.one(second);

    if (Object.keys(range).length > 0) {
        const bytesStart = parseInt(range['bytes'].split('/')[0]);
        const bytesEnd = parseInt(range['bytes'].split('/')[1]);
        const content = require('@functions/getFileContent')(trackFilePath, bytesStart, bytesEnd);
        const headers = {
            'Content-Type': 'audio/mpeg',
            'Content-Length': `${bytesEnd - bytesStart}`
        };

        res.writeHead(200, headers).write(content);
        res.end();
    } else {
        res.status(404).json({ message: 'not found', route: '/range' });
    }
});

app.listen(port, () => {
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
        if (!fs.existsSync(require('@config').storagePath)) {
            fs.mkdirSync(require('@config').storagePath);
        }
    }

    console.log(`Example app listening at http://localhost:${port}`)
});