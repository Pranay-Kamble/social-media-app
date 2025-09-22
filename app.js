import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import userRoutes from './routes/user.js';
import commentRoutes from './routes/comment.js';
import postRoutes from './routes/post.js';
import methodOverride from 'method-override'
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import ejsMate from 'ejs-mate'
import AppError from './utils/AppError.js';
import session from 'express-session';
import flash from 'connect-flash'
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/User.js';
import dotenv from 'dotenv';
import MongoStore from 'connect-mongo';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const dbUrl = process.env.MONGODB_URI;

const app = express();

await async function mongoConnect() {
    try {
        await mongoose.connect(dbUrl);
        console.log('Connected to the MongoDB');
    } catch (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1);
    }
}();

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on('error', function(e) {
    console.log("Session Store Error: " + e.message);
});

const sessionConfig = {
    store,
    secret : 'thisshouldbeabettersecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //expires in 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(path.dirname(__filename), 'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.use(morgan('tiny'));

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req,res) => {
    res.render('home');
})

//Routes
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/users', userRoutes);

app.all(/(.*)/, (req, res) => {
    console.log('Ending all route reached')
    throw new AppError('Page Not Found', 404);
})

app.use((err, req, res, next) => {
    const { status } = err;
    res.status(status || 500).render('error', { err })
})

app.listen(3000, () => {
    console.log("Running on PORT 3K");
})