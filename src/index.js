import app from "./app.js";
import { dbConnect } from "./dbConnect/dbConnect.js";

dbConnect()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(
        `server is running PORT:${process.env.PORT}`.bgBlack.white.bold
      );
    });
  })
  .catch((er) => console.log(er.message));
