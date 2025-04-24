// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Mock database (in a real app, use MongoDB/PostgreSQL)
let users = [];
let submissions = [];

// Routes
app.post('/api/register', (req, res) => {
    const { name, email, password, phone } = req.body;
    
    if (users.some(u => u.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }
    
    const newUser = { id: Date.now(), name, email, password, phone };
    users.push(newUser);
    
    res.status(201).json(newUser);
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json(user);
});

app.post('/api/submissions', upload.array('files'), (req, res) => {
    const { buildingType, stylePreferences, vibeDescription, budgetRange, timeline, userId } = req.body;
    const files = req.files ? req.files.map(f => f.filename) : [];
    
    const newSubmission = {
        id: Date.now(),
        userId,
        buildingType,
        stylePreferences,
        vibeDescription,
        budgetRange,
        timeline,
        files,
        status: 'new',
        createdAt: new Date().toISOString()
    };
    
    submissions.push(newSubmission);
    res.status(201).json(newSubmission);
});

app.get('/api/submissions', (req, res) => {
    res.json(submissions);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});