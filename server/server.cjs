const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

require("isomorphic-fetch");
const { Client } = require("@microsoft/microsoft-graph-client");
const { ClientSecretCredential } = require("@azure/identity");

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

  const CLIENT_ID = "5a58e660-dc7b-49ec-a48c-1fffac02f721";
const CLIENT_SECRET = "6_I8Q~U7IbS~NERqNeszoCRs2kETiO1Yc3cXAaup";
const TENANT_ID = "1c3de7f3-f8d1-41d3-8583-2517cf3ba3b1";
const SENDER_EMAIL = "leaf@premierenergies.com";

const credential = new ClientSecretCredential(
  TENANT_ID,
  CLIENT_ID,
  CLIENT_SECRET
);

const graphClient = Client.initWithMiddleware({
  authProvider: {
    getAccessToken: async () => {
      const tokenResponse = await credential.getToken(
        "https://graph.microsoft.com/.default"
      );
      return tokenResponse.token;
    },
  },
});

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

app.post('/api/send-tabulated-email', async (req, res) => {
  try {
    const {
      name,
      contactNumber,
      serviceDate,
      deceasedName,
      services,
      ratings,
      otherService,
      comments,
    } = req.body;

    // Helper to safely display boolean as Yes/No
    const yesNo = (val) => (val ? 'Yes' : 'No');

    // Build Services table rows dynamically
    const servicesHtml = Object.entries(services || {})
      .map(
        ([key, value]) =>
          `<tr><td>${key.charAt(0).toUpperCase() + key.slice(1)}</td><td>${yesNo(value)}</td></tr>`
      )
      .join('');

    // Build Ratings table rows dynamically
    const ratingsHtml = Object.entries(ratings || {})
      .map(
        ([key, value]) =>
          `<tr><td>${key.charAt(0).toUpperCase() + key.slice(1)}</td><td>${value || 'N/A'}</td></tr>`
      )
      .join('');

    // Construct the full HTML content
    const htmlContent = `
      <h2>Automated Feedback Summary</h2>
      <h3>Basic Information</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
        <tr><td><strong>Name</strong></td><td>${name || 'N/A'}</td></tr>
        <tr><td><strong>Contact Number</strong></td><td>${contactNumber || 'N/A'}</td></tr>
        <tr><td><strong>Date of Service</strong></td><td>${serviceDate || 'N/A'}</td></tr>
        <tr><td><strong>Name of Deceased</strong></td><td>${deceasedName || 'N/A'}</td></tr>
      </table>

      <h3>Services Availed</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
        <thead><tr style="background-color:#f2f2f2;"><th>Service</th><th>Provided</th></tr></thead>
        <tbody>
          ${servicesHtml}
          ${
            services?.other
              ? `<tr><td>Other Service Details</td><td>${otherService || 'N/A'}</td></tr>`
              : ''
          }
        </tbody>
      </table>

      <h3>Ratings</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
        <thead><tr style="background-color:#f2f2f2;"><th>Aspect</th><th>Rating</th></tr></thead>
        <tbody>
          ${ratingsHtml}
        </tbody>
      </table>

      <h3>Additional Comments</h3>
      <p>${comments || 'None'}</p>

      <p>Regards,<br/>Swarg Vatika Team</p>
    `;

    const message = {
      message: {
        subject: "Swarg Vatika New Feedback Submission",
        body: {
          contentType: "HTML",
          content: htmlContent,
        },
        toRecipients: [
          { emailAddress: { address: "aarnav.singh@premierenergies.com" } },
          { emailAddress: { address: "info@swargvatika.org" } },
          { emailAddress: {address: "sps@premierenergies.com" } },
        ],
      },
      saveToSentItems: true,
    };

    await graphClient.api(`/users/${SENDER_EMAIL}/sendMail`).post(message);

    res.status(200).json({ message: "Tabulated email sent successfully." });
  } catch (error) {
    console.error("Error sending tabulated email:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
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
