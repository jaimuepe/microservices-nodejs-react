const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/events', async (req, res) => {

    const { type, data } = req.body;
    console.log('Processing event', type);
    
    if (type === 'CommentCreated') {

        const { id, content, postId } = data;

        const status = content.includes('orange') ? 'rejected' : 'approved';

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentModerated',
            data: {
                id,
                postId,
                status,
                content
            }
        });
    }

    res.send({});
});

app.listen(4003, () => {
    console.log('Listening on port 4003');
});