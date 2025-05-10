// server/index.ts
import express from "express";
import bodyParser from "body-parser";
import saveUser from "./../routes/saveUser";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Mount route
app.use("/api", saveUser);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
