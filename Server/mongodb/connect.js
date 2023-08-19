import mongoose from "mongoose";

const connectDB = (url) => {
    mongoose.connect('mongodb://localhost:27017/trains', {
        useNewUrlParser: true,
        useUnifiedTopology: true
     }).then(r => console.log('connected'))
        .catch((err) => console.log(err));
}

export default connectDB;
