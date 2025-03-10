const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const session = require('express-session');
const FirebaseStore = require('connect-session-firebase')(session);
const admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");

const serviceAccount = require('./serviceAccountKey');

// app.use(fileParser)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());
app.use(cookieParser());
app.use(express.static('public'));

// Automatically allow cross-origin requests
app.use(cors({
  origin: [
    'https://www.matchingjodi.com',
     '*' ],
  credentials: true
}));


app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "font-src 'self' data:;");
  next();
});


// Initialize Firebase app if it's not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
  });
}

const bucket = admin.storage().bucket();
const db = admin.firestore();

db.settings({
  host: 'firestore.googleapis.com',
  ssl: true,
})

app.use(session({ 
  name: "__session",
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  store: new FirebaseStore({
    database: admin.database()
  }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));


// Import routes after initializing express-session
const userRoutes = require("./src/routes/userRoutes");
const pageRoutes = require('./src/routes/pageRoutes');
const routes = require('./src/routes/routes');
const adminPageRoutes = require('./src/routes/adminPageRoutes');
const pdfroute =  require('./pdfTemplate/pdfGenerate')

app.use("/", userRoutes);
app.use("/admin", adminPageRoutes);
app.use('/api', routes);
app.use('/api', pdfroute);
app.use('/dashboard', pageRoutes);

app.get("/login", (req, res) => {
  if (req.session && req.session.role) {
    if (req.session.role === 'admin' || 'superAdmin') {
      // If authenticated as admin, redirect to the admin dashboard
      return res.redirect("/admin/dashboard");
    } else {
      // If authenticated as any other role, redirect to the employee dashboard
      return res.redirect("/employee/dashboard");
    }
  }
  // If not authenticated, serve the common login page
  res.sendFile(path.join(__dirname, "public", "employees", "loginPage.html"));
});



// Listen locally for development
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server Started, http://localhost:${PORT}`);
});
