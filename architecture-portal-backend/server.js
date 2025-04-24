const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Database connection
const connectDB = require('./config/db');
connectDB();

// Route files
const auth = require('./routes/authRoutes');
const submissions = require('./routes/submissionRoutes');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

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

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/submissions', submissions);

// Temporary mock database routes (can be removed after full implementation)
let users = [];
let submissions = [];

// Mock routes (transitional - can be removed once MongoDB is fully implemented)
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});