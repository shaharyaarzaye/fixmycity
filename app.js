const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');

const User = require('./models/user');
const Issue = require('./models/issue');

const app = express();

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// View engine setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/users', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => res.render('landing'));

app.get('/login', (req, res) => res.render('login'));

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const issues = await Issue.find({});
        res.render('home', { user, issues });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/signup', (req, res) => res.render('signup'));

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }
    try {
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.redirect('login');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/new', (req, res) => res.render('new'));

app.get('/home', async (req, res) => {
    try {
        const issues = await Issue.find({}).sort({ Date: -1 }).populate('user', 'username');
        res.render('home', { user: req.user, issues });
    } catch (error) {
        console.error('Error fetching issues:', error);
        res.status(500).json({ message: 'Error fetching issues' });
    }
});

// Add a new route for voting
app.post('/vote/:issueId', async (req, res) => {
    const { issueId } = req.params;
    const { type } = req.body;

    try {
        const issue = await Issue.findById(issueId);
        if (!issue) {
            return res.status(404).json({ success: false, message: 'Issue not found' });
        }

        // Implement your voting logic here
        // For example:
        if (type === 'up') {
            issue.votes = (issue.votes || 0) + 1;
        } else if (type === 'down') {
            issue.votes = (issue.votes || 0) - 1;
        }

        await issue.save();

        res.json({ success: true, newVoteCount: issue.votes });
    } catch (error) {
        console.error('Error voting on issue:', error);
        res.status(500).json({ success: false, message: 'Error voting on issue' });
    }
});

// Update the /upload route to include the user
app.post('/upload', upload.single('image'), async (req, res) => {
    const { issuetype, Description, location, Date } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newIssue = new Issue({
        issuetype,
        Description,
        location,
        Date,
        image,
        // user field is now optional, so we can omit it if there's no authentication
    });

    try {
        await newIssue.save();
        res.redirect('/home');
    } catch (error) {
        console.error('Error creating new issue:', error);
        res.status(500).render('error', { message: 'Error creating new issue. Please try again.' });
    }
});

app.get('/home', async (req, res) => {
    try {
        const issues = await Issue.find({}).sort({ Date: -1 });
        res.render('home', { issues, user: null }); // Pass null for user if no authentication
    } catch (error) {
        console.error('Error fetching issues:', error);
        res.status(500).render('error', { message: 'Error fetching issues. Please try again.' });
    }
});

// Add a general error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Something went wrong! Please try again.' });
});
app.get('/logout', (req, res) => res.render('landing'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));















