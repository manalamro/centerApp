// const express = require('express');
// const mongoose = require('mongoose');
// const authMiddleware = require('./middleware/authMiddleware');
// const app = express();
// const routes = require('./routes/itemsRoute');
// const cors = require("cors");
// const uri = "mongodb+srv://manalamro538:BLFYttcGpXfiAYjV@cluster0.yzi6tra.mongodb.net/EduCenterData?retryWrites=true&w=majority";
// const path = require('path');

// const bodyParser = require('body-parser');
// const corsOptions = {
//     origin: "http://localhost:3000",
// };

// app.use(cors(corsOptions));
// app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: true }));

// async function connect() {
//     try {
//         await mongoose.connect(uri);
//         console.log("Connected to MongoDB");
//     } catch (error) {
//         console.log(error);
//     }
// }
// connect();


// // Use the routes in your application
// app.use('/api', routes);

// // Protected route using authentication middleware
// // app.get('/api/protected', authMiddleware.authenticate, (req, res) => {
// //     res.status(200).json({ message: 'You are authenticated' });
// // });


// app.listen(5000, () => {
//     console.log("Server started on port 5000");
// });


const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/authMiddleware');
const app = express();
const routes = require('./routes/itemsRoute');
const cors = require("cors");
const dotenv = require('dotenv'); // Import dotenv package
dotenv.config(); // Load .env file

const uri = process.env.MONGO_URL; // Using URI from .env file
const path = require('path');

const bodyParser = require('body-parser');
const corsOptions = {
    origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}
connect();

// Use the routes in your application
app.use('/api', routes);


app.listen(5000, () => {
    console.log("Server started on port 5000");
});
