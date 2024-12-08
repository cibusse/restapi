const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const uri = 'mongodb+srv://charlotte1282:tYiWDN0LK2z2fsqE@cluster0.vuc5b.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Mongoose schema
const musicSchema = new mongoose.Schema({
    code: { type: Number, required: true, unique: true },
    song_title: { type: String, required: true },
    artist: { type: String, required: true },
    album: String,
    genre: String,
    year: Number,
}, { collection: 'music' });

const Music = mongoose.model('Music', musicSchema);

// Get all music data
app.get('/api/getall', async (req, res) => { 
    try {
        const musicData = await Music.find();
        res.status(200).json(musicData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching music data' });
    }
});

// Get music by code
app.get('/api/:code', async (req, res) => {
    const code = req.params.code;
    try {
        const music = await Music.findOne({ code: code }); // Use findOne with filter
        if (!music) {
            return res.status(404).json({ message: 'Music not found' });
        }
        res.status(200).json(music);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching music' });
    }
});

// Add new music data
app.post('/api/add', async (req, res) => {
    const { code, song_title, artist, album, genre, year } = req.body;
    if (!code || !song_title || !artist) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newMusic = new Music({ code, song_title, artist, album, genre, year });
        await newMusic.save();
        res.status(201).json({ message: 'Music added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding music' });
    }
});

// Update music by code
app.put('/api/update/:code', async (req, res) => {
    const code = req.params.code;
    const updates = req.body; 

    try {
        const music = await Music.findOneAndUpdate({ code: code }, updates, { new: true });
        if (!music) {
            return res.status(404).json({ message: 'Music not found' });
        }
        res.status(200).json({ message: 'Music updated successfully', music });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating music' });
    }
});

// Delete music by code
app.delete('/api/delete/:code', async (req, res) => {
    const code = req.params.code;

    try {
        const music = await Music.findOneAndDelete({ code: code }); // Use findOneAndDelete with filter
        if (!music) {
            return res.status(404).json({ message: 'Music not found' });
        }
        res.status(200).json({ message: 'Music deleted successfully', music });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting music' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});