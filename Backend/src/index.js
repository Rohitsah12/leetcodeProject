const express = require('express')
const app = express();
require('dotenv').config();
const main = require('./config/db')
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/userAuth');
const redisClient = require('./config/redis');
const problemRouter = require('./routes/problemCreator');
const submitRouter = require('./routes/submit');
const aiRouter = require('./routes/AiChatting');
const cors = require('cors');
const videoRouter = require('./routes/videoCreator');
const session = require('express-session'); 
const MongoStore = require('connect-mongo');
const passport = require('passport'); 
const userRouter = require('./routes/userRouter');
const collegeRouter = require('./routes/college');

app.set('trust proxy', 1);

// Enhanced CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [process.env.FRONTEND_URL];
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    exposedHeaders: ['set-cookie'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200
}));

// Session configuration for Google OAuth
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_CONNECT_STRING,
        ttl: 24 * 60 * 60 // 24 hours in seconds
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        // Add domain for production
        domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined
    }
}));

app.use(passport.initialize()); 
app.use(passport.session()); 
require('./config/passport'); 

app.use(express.json());
app.use(cookieParser());

// Debug middleware (remove in production)
app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Cookies received:', req.cookies);
        console.log('Session:', req.session?.id ? 'Present' : 'Not present');
    }
    next();
});

app.use('/user', authRouter);
app.use('/problem', problemRouter)
app.use('/submission', submitRouter)
app.use('/ai', aiRouter);
app.use('/video', videoRouter)
app.use('/userProfile',userRouter)
app.use('/college',collegeRouter)

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Application is running..."
    })
})

const InitializeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("DB connected");
        app.listen(process.env.PORT, () => {
            console.log("Server listening at port number: " + process.env.PORT);
        });
    }
    catch (err) {
        console.log("Error :" + err);
    }
}

InitializeConnection()
