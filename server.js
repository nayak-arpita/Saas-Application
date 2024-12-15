const express = require('express');
const jwt = require('jwt-simple');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Set up Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
}, (token, refreshToken, profile, done) => {
    const payload = { id: profile.id, email: profile.emails[0].value };
    done(null, jwt.encode(payload, process.env.JWT_SECRET));
}));

// Google authentication route
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback route
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.send({ message: "Authentication Successful", token: req.user });
    }
);

// Example protected route
app.get('/protected', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token is required');
    try {
        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        res.send(`Welcome, ${decoded.email}`);
    } catch (e) {
        res.status(401).send('Invalid token');
    }
});

// Basic Pomodoro timer endpoint
let timer = { sessionTime: 25, breakTime: 5 };  // Default to 25 mins work, 5 mins break

app.post('/set-timer', (req, res) => {
    const { sessionTime, breakTime } = req.body;
    timer = { sessionTime, breakTime };
    res.json({ message: "Timer updated successfully", timer });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
