// server/routes/saveUser.ts
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const dataPath = path.join(__dirname, "./../../data/userLoginData.json");

router.post("/save-user", (req, res) => {
  const { name, email, password, role } = req.body;

  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ message: "Read error" });

    const json = JSON.parse(data);
    json.users.push({ name, email, password, role });

    fs.writeFile(dataPath, JSON.stringify(json, null, 2), (err) => {
      if (err) return res.status(500).json({ message: "Write error" });

      res.status(200).json({ message: "User saved successfully" });
    });
  });
});

export default router;
