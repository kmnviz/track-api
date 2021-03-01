const path = require('path');
const crypto = require('crypto');
const express = require('express');
const app = express();
const port = 3030;

const uniqueId = (bytes) => {
    return `t-${crypto.randomBytes(bytes).toString('hex')}`;
};

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.json({ message: 'hello', route: '/' });
});

app.post('/test', (req, res) => {
    res.json({ message: 'hello', route: '/test' });
});

app.post('/upload/:user_id', (req, res) => {
    const userId = req.params['user_id'];
    const trackId = uniqueId(8);
    const upload = require('./upload')(userId, trackId);

    upload(req, res, (err) => {});

    res.json({ message: 'hello', route: '/upload', trackId: trackId });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});