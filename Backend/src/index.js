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

const allowedOrigins = [process.env.FRONTEND_URL, process.env.FRONTEND_URL2];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_CONNECT_STRING,
        ttl: 10 * 60 
    }),
    cookie: {
        maxAge: 10 * 60 * 1000, // 10 minutes
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax'
    }
}));

app.use(passport.initialize()); 
app.use(passport.session()); 
require('./config/passport'); 

app.use(express.json());
app.use(cookieParser());

app.use('/user', authRouter);
app.use('/problem', problemRouter)
app.use('/submission', submitRouter)
app.use('/ai', aiRouter);
app.use('/video', videoRouter)
app.use('/userProfile',userRouter)
app.use('/college',collegeRouter)

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