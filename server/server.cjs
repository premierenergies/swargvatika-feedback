const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Use CORS middleware with default options to allow all origins
app.use(cors());

// Body parser middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// --- MongoDB connection ---
mongoose.connect(
  'mongodb+srv://aarnavsingh836:Cucumber1729@rr.oldse8x.mongodb.net/visa?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Define Feedback Schema ---
const feedbackSchema = new mongoose.Schema({
  name: String,
  contactNumber: String,
  serviceDate: String,
  deceasedName: String,
  services: {
    mortuary: Boolean,
    cremationGround: Boolean,
    rath: Boolean,
    cremation: Boolean,
    priestServices: Boolean,
    poojaSamagri: Boolean,
    seatingTent: Boolean,
    waterBottles: Boolean,
    ashCollection: Boolean,
    airConditioning: Boolean,
    bhajan: Boolean,
    receipt: Boolean,
    other: Boolean,
  },
  otherService: String,
  ratings: {
    cleanliness: Number,
    helpfulness: Number,
    timeliness: Number,
    availability: Number,
    transparency: Number,
    coordination: Number,
  },
  comments: String,
  feedbackType: String,
}, { timestamps: true });

// --- Create Feedback model ---
const Feedback = mongoose.model('Feedback', feedbackSchema);

// --- Feedback submission endpoint ---
app.post('/api/submit-feedback', async (req, res) => {
  try {
    console.log('Received feedback submission request');
    console.log('Request body:', req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'No data received' });
    }

    const {
      name,
      contactNumber,
      serviceDate,
      deceasedName,
      services,
      ratings,
      otherService,
      comments,
      feedbackType,
    } = req.body;

    if (!name || !contactNumber) {
      return res.status(400).json({ message: 'Name and contact number are required' });
    }

    const newFeedback = new Feedback({
      name,
      contactNumber,
      serviceDate,
      deceasedName,
      services,
      ratings,
      otherService,
      comments,
      feedbackType: feedbackType || 'experience',
    });

    await newFeedback.save();
    console.log('Feedback saved successfully');
    return res.status(200).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return res.status(500).json({ message: 'Error saving feedback', error: error.message });
  }
});

// --- Error handling middleware ---
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// --- Start server ---
const PORT = process.env.PORT || 7733;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('CORS is enabled for all origins');
});
