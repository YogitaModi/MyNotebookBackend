const mongoose = require("mongoose");

const connectToMongo = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(
      "mongodb+srv://yogitamodi99:viscosityEquilibrium99@cluster1.dhqeg4b.mongodb.net/myNoteBook?retryWrites=true&w=majority",
      connectionParams
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
    console.log("Database connection failed");
  }
};
module.exports = connectToMongo;
