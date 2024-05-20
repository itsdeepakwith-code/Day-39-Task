const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://deepakmohanan17:5sWuvN0RG9vMefLS@cluster3000.dle1gq4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster3000', {
      useNewUrlParser: true,

      //mongodb+srv://deepakmohanan17:<password>@cluster3000.dle1gq4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster3000
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process on error
  }
};

module.exports = connectDB;
