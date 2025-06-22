const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userRoute = require("./routes/user");
const testRoutes = require("./routes/test");
const authRoute = require("./routes/auth");
const streamRoutes = require('./routes/stream');
const topicRoutes = require("./routes/topic");
const adminRoutes = require('./routes/admin');
const subjectRoutes = require("./routes/subject");
const questionRoutes = require("./routes/question");

const cors = require('cors');


const app = express();
require("dotenv").config();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
// View engine
app.use(cors());

require("./config/db");

// Routes
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use('/admin',adminRoutes)
app.use('/api/streams', streamRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/questions', questionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
