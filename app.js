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

const __filename = fileURLToPath(import.meta.url);

mongoose.connect('mongodb://127.0.0.1/SocialMediaApplication')
        .then(() => {
            console.log('Connected to the MongoDB');
        })
        .catch(() => {
            console.log("Bruhh! There is some error");
        })

const app = express();
const sessionConfig = {
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
    res.render('newWeb/home');
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
    res.status(status || 500).render('newWeb/error', { err })
})

app.listen(3000, () => {
    console.log("Running on PORT 3K");
})