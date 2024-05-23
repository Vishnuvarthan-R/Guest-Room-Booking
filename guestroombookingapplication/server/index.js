const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors module
const signupDetails = require('./models/schema')
const jwt = require('jsonwebtoken');
const Booking = require('./models/booking')

const app = express();
app.use(express.static('public')) 


// Enable CORS
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/roomManager', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for the room model
const roomSchema = new mongoose.Schema({
  name: String,
  file: String ,
  minBookingPeriod:String,
  maxBookingPeriod:String,
  rentPerDay:String,
  description:String,
  floorsize:String,
  numberofbed:String,
  isBooked: { type: Boolean, default: false }// Assuming the file is stored as a string (file path or URL)
});
const Room = mongoose.model('Room', roomSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/Images'); // Store uploaded files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename for the uploaded file
  }
});
const upload = multer({ storage: storage });

// POST endpoint to handle room creation
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { name,minBookingPeriod,maxBookingPeriod,rentPerDay,description,floorsize,numberofbed } = req.body;
    const file = req.file.filename; // Get the filename of the uploaded file

    // Create a new room instance
    const newRoom = new Room({
      name,
      file,
      minBookingPeriod,
      maxBookingPeriod,
      rentPerDay,
      description,
      floorsize,
      numberofbed
    });

    // Save the room to the database
    await newRoom.save();

    res.status(200).send('Room created successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
  
})

app.post('/booking', async (req, res) => {
  const { roomName } = req.body;
  const room = await Room.findOne({ name: roomName });
  if (room) {
    room.isBooked = true;
    await room.save();
    res.send('booking success');
  } else {
    res.send('booking failed');
  }
});

app.get('/getBooking', async (req, res) => {
  // Get the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, 'your-secret-key');
    const userId = decoded.userId;

    // Find bookings for the current user
    Booking.find({ userId: userId })
      .then(bookings => res.json(bookings))
      .catch(err => res.status(500).json(err));
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
});


app.post('/login', (req, res) =>{
    const {email, password} = req.body
    signupDetails.findOne({email: email})
    .then(user =>{
        if(user){
            if(user.password === password && user.userType === "House Owner"){
                res.json("login success")
            }
            else if(user.password === password && user.userType === "Customer"){
                res.json("success")
            }
            else{
                res.json("password is incorrect")
            }
        }else{
            res.json("no record existed")
        }
        
    })
})
app.post('/register',(req,res) =>{
    signupDetails.create(req.body)
    .then(resl =>res.json(resl))
    .catch(err =>res.json(err))
})

app.get('/getImage', async (req, res) => {
     Room.find()
    .then(users => res.json(users))
    .catch(err => res.json(err))
});

app.put('/update/:id', upload.single('file'), (req, res) => {
  const { name, minBookingPeriod, maxBookingPeriod, rentPerDay } = req.body;
  const updateData = { name, minBookingPeriod, maxBookingPeriod, rentPerDay };

  if (req.file) {
    updateData.file = req.file.filename;
  }

  Room.findByIdAndUpdate(req.params.id, updateData, { new: true })
    .then(room => res.json(room))
    .catch(err => res.status(400).json(err));
});

app.delete('/delete/:id', (req, res) => {
  Room.findByIdAndDelete(req.params.id)
    .then(() => res.json({ success: true }))
    .catch(err => res.status(400).json(err));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
