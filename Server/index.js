import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connect from './mongodb/connect';
import mongoose from "mongoose";
import util from 'util';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb'}));

app.get('/', async (req, res) => {
  res.send('Hello buddy');
})

app.post('http://20.244.56.144/train/register', async (req, res) => {
  const company = req.body;

  // Check if the company name is already taken
  const existingCompany = await company.findOne({ name: company.name });
  if (existingCompany) {
    res.status(400).send('Company name already taken');
    return;
  }

  // Create a new company document
  const newCompany = new company({
    name: company.name,
    ownerName: company.ownerName,
    ownerEmail: company.ownerEmail,
    accessCode: company.accessCode,
    clientID: company.clientID,
    clientSecret: company.clientSecret
  });

  await newCompany.save();

  res.status(200).send({
    companyName: company.name,
    clientID: company.clientID,
    clientSecret: company.clientSecret
  });
});


app.post('http://20.244.56.144/train/auth', async (req, res) => {
  const company = req.body;

  // Check if the company exists
  const existingCompany = await company.findOne({ name: company.name });
  if (!existingCompany) {
    res.status(400).send('Company does not exist');
    return;
  }

  // Check if the client secret is valid
  if (company.clientSecret !== existingCompany.clientSecret) {
    res.status(401).send('Invalid client secret');
    return;
  }

  // Generate the auth token
  const token = jwt.sign({
    companyName: company.name,
    ownerName: company.ownerName,
    rollNo: company.rollNo,
    ownerEmail: company.ownerEmail
  }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).send({
    token_type: 'bearer',
    access_token: token,
    expires_in: 3600
  });
});

app.get('http://20.244.56.144/train/trains', async (req, res) => {
  // Check if the auth token is valid
  const authHeader = req.headers['Authorization'];
  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).send('Unauthorized');
    return;
  }
  const Train = mongoose.model('Train', {
  trainName: String,
  trainNumber: String,
  departureTime: Date,
  seatsAvailableSleeper: Number,
  seatsAvailableAC: Number,
  priceSleeper: Number,
  priceAC: Number,
  delayedBy: Number
});
  // Get all the trains
  const trains = await Train.find();
  const response = {
    trains: Array.prototype.map((train) => ({
      trainName: train.trainName,
      trainNumber: train.trainNumber,
      departureTime: train.departureTime,
      seatsAvailable: {
        sleeper: train.seatsAvailableSleeper,
        AC: train.seatsAvailableAC
      },
      price: {
        sleeper: train.priceSleeper,
        AC: train.priceAC
      },
      delayedBy: train.delayedBy
    }))
  };

  res.status(200).send(response);
});

app.get('http://20.244.56.144/train/trains/2344', async (req, res) => {
  // Check if the auth token is valid
  const authHeader = req.headers['Authorization'];
  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).send('Unauthorized');
    return;
  }
  // Get the train number
  const trainNumber = req.params.trainNumber;
  // Get the train
  const train = await train.findOne({ trainNumber });

  // Create the response object
  const response = {
    train: train ? ({
      trainName: train.trainName,
      trainNumber: train.trainNumber,
      departureTime: train.departureTime,
      seatsAvailable: {
        sleeper: train.seatsAvailableSleeper,
        AC: train.seatsAvailableAC
      },
      price: {
        sleeper: train.priceSleeper,
        AC: train.priceAC
      },
      delayedBy: train.delayedBy
    }) : null
  };

  res.status(200).send(response);
});


const startServer = async () => {
  connect();
  app.listen(8080, () => console.log('server has started on port http://localhost:8080'))
}

startServer().then(r => console.log('called startServer() function'));
