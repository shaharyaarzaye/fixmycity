const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const app = express();
const path = require('path');
const User = require('./models/user')
const Issue = require('./models/issue');

// Make sure this comes before your routes


app.use(express.static(path.join(__dirname, 'public')));


// app.use(session({
//     secret: 'your-secret-key', // Replace with a real secret key
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({ 
//         mongoUrl: 'mongodb://localhost:27017/users',
//         touchAfter: 24 * 3600 // time period in seconds
//     }),
//     cookie: { 
//         maxAge: 1000 * 60 * 60 * 24 // 24 hours
//     }
// }));

// const isAuthenticated = (req, res, next) => {
//     if (req.session && req.session.user) {
//         next();
//     } else {
//         res.status(401).json({ message: 'Not authenticated' });
//     }
// };


mongoose.connect('mongodb://localhost:27017/users', {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));

//for adding html file as a view
// app.set('views', path.join(__dirname, 'views'));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

app.get('/', (req , res) => {
    res.render('landing')
})

app.get('/login', (req, res) => {
    res.render('login'); // This assumes you have a login.ejs file in your views directory
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if(user){


    }
});

// app.use((req, res, next) => {
//     console.log('Session:', req.session);
//     console.log('User:', req.session ? req.session.user : 'No session');
//     next();
// });


app.get('/signup' , (req , res) => {
    res.render('signup')
});
app.post('/signup', async (req, res) => {
    console.log('Username', req.body.username);   // Log the request body
    console.log("password : " , req.body.password);
    console.log("email:" , req.body.email)
    const { username, email , password } = req.body;
    // Log the current status code

       // Check if both fields are provided
       if (!username || !email || !password) {
        console.log('Username and password are required')
    }

    try {
        // Check if the username already exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            console.log("user already exist")
        }

        // Create a new user with the plain-text password
        const newUser = new User({
            username,
            email,
            password,  // Storing plain-text password (not recommended for production)
        });

        // Save the user to the database
        await newUser.save();
        // res.status(201).json({ message: 'User created successfully' });
        res.redirect('login')

    } catch (error) {
        console.error(error);
    }


    // You can also send a response back to the client if you want
    // res.send('Request received');
});


app.get('/new' , (req , res) =>{
    res.render('new')
})





// Set up multer for handling file uploadsconst express = require('express');

// Set up multer for handling file uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/') // Make sure this folder exists
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname)) // Appending extension
//     }
// });

// const upload = multer({ storage: storage });

// Middleware to check if user is authenticated


// POST route for creating a new issue
// app.post('/new', isAuthenticated, upload.single('image'), async (req, res) => {
//     try {
//         const { issuetype, location, date } = req.body;
//         const username = req.session.user.username;

//         const newIssue = new Issue({
//             username,
//             issuetype,
//             location,
//             image: req.file.path, // Path where the image is saved
//             date: new Date(date) // Convert the date string to a Date object
//         });

//         await newIssue.save();
//         res.status(201).json({ message: 'Issue created successfully', issue: newIssue });
//     } catch (error) {
//         console.error('Error creating new issue:', error);
//         res.status(500).json({ message: 'Error creating new issue', error: error.message });
//     }
// });





app.listen(3000 , () => {
    console.log("Hyyyy  listening on port 3000");
})
