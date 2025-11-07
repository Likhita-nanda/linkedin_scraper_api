// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize, Profile } = require('./models/profile');

const app = express();
app.use(cors()); // allow requests from extension
app.use(bodyParser.json());

app.post('/profiles', async (req, res) => {
  try {
    const payload = req.body;
    // Basic validation (url required)
    if (!payload.url) return res.status(400).json({ error: 'url is required' });

    const profile = await Profile.create(payload);
    res.status(201).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



app.get('/profiles', async (req, res) => {
  const all = await Profile.findAll({ order: [['createdAt','DESC']] });
  res.json(all);
});

// app.get("/", (req, res) => {
//   res.send("🚀 Server is running successfully!");
// });


const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
});
