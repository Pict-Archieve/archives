import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "../.env",
});

connectDB()
  .then(() => {
    try {
      const port = process.env.PORT || 8000;
      app.on("error", (error) => {
        console.log("Error in express server : ", error);
        throw error;
      });
      app.listen(port, () => {
        console.log(`Server running on port ${port} 🔥`);
      });
    } catch (error) {
      console.log("Error in express server : ", error);
    }
  })
  .catch((error) => {
    console.log("Mongo DB Connection Failed in Index ", error);
  });
