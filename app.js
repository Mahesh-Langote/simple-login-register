const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/loginSystemIcem')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

app.use(session({
    secret: '123',
}));


const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String,
}));



app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/err', (req, res) => {
    res.render('error');
})

app.get('/welcome', (req, res) => {
    if (req.session.username) {
        res.render('welcome', { username: req.session.username });
    } else {
        res.redirect('/login');
    }
});


app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.redirect('/login');
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        req.session.username = username;
        res.redirect('/welcome');
    } else {
        res.redirect('/err');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/welcome');
        }
        res.redirect('/login');
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
