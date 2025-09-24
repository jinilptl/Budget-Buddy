import "dotenv/config";

import app from "./app.js";

import Connect_Db from "./config/Db.js";

Connect_Db()
  .then(() => {
    app.listen(process.env.PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });
