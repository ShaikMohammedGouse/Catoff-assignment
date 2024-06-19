const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const githubRoutes = require('./routes/githubRoutes');
const twitterRoutes = require('./routes/twitterRoutes');
const facebookRoutes = require('./routes/facebookRoutes');
const googleRoutes = require('./routes/googleRoutes');

app.use('/github', githubRoutes);
app.use('/twitter', twitterRoutes);
app.use('/facebook', facebookRoutes);
app.use('/google', googleRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
