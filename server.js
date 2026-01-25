const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Preset accounts - Expanded Structure
// Data stored in memory (resets on restart)
const users = {
    'admin': {
        password: 'password123',
        nickname: 'Admin User',
        hobbies: ['Coding', 'Managing'],
        profilePic: 'imgs/propicph.png'
    },
    'student1': {
        password: 'password123',
        nickname: 'Student One',
        hobbies: ['Reading', 'Sports'],
        profilePic: 'imgs/propicph.png'
    },
    'test': {
        password: 'test',
        nickname: 'Test User',
        hobbies: ['Testing'],
        profilePic: 'imgs/propicph.png'
    }
};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add JSON support for AJAX requests
app.use(session({
    secret: 'secret-key', // Change this for production
    resave: false,
    saveUninitialized: true
}));

// Serve static files
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/imgs', express.static(path.join(__dirname, 'imgs')));
app.use(express.static(path.join(__dirname, 'public')));

// Serve CSS and JS files from root
app.get('/*.css', (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});
app.get('/*.js', (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});

// --- Routes ---

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username].password === password) {
        req.session.loggedIn = true;
        req.session.username = username;
        res.redirect('/invitations.html');
    } else {
        res.send(`<script>alert('Invalid credentials'); window.location.href='/';</script>`);
    }
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

// API: Get Profile Data
app.get('/profile-data', (req, res) => {
    if (req.session.loggedIn && users[req.session.username]) {
        const username = req.session.username;
        const userData = users[username];
        // Return public info + password (since user can see own password to change it)
        // In real app, don't send password like this.
        res.json({
            username: username,
            nickname: userData.nickname,
            hobbies: userData.hobbies,
            password: userData.password,
            profilePic: userData.profilePic
        });
    } else {
        res.status(401).json({ error: 'Not logged in' });
    }
});

// API: Update Profile
app.post('/update-profile', (req, res) => {
    if (req.session.loggedIn && users[req.session.username]) {
        const { nickname, hobbies, password } = req.body;
        const user = users[req.session.username];

        if (nickname) user.nickname = nickname;
        if (hobbies) user.hobbies = hobbies; // Expecting array
        if (password) user.password = password;

        res.json({ success: true, message: 'Profile updated' });
    } else {
        res.status(401).json({ error: 'Not logged in' });
    }
});

// Protected Route: Invitations
app.get('/invitations.html', (req, res) => {
    if (req.session.loggedIn) {
        res.sendFile(path.join(__dirname, 'invitations.html'));
    } else {
        res.redirect('/');
    }
});

// Protected Route: Profile
app.get('/profile.html', (req, res) => {
    if (req.session.loggedIn) {
        res.sendFile(path.join(__dirname, 'profile.html'));
    } else {
        res.redirect('/');
    }
});

// Protected Route: Ongoing
// Decided to protect ongoing as well since profile is protected and connected
app.get('/ongoing.html', (req, res) => {
    if (req.session.loggedIn) {
        res.sendFile(path.join(__dirname, 'ongoing.html'));
    } else {
        res.redirect('/');
    }
});

// Public Route: Home (Index)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
