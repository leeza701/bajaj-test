const express = require("express");
const cors = require("cors");
const path = require("path");

const { processHierarchy } = require("./hierarchyProcessor");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/bfhl", (req, res) => {
  try {
     console.log(req.body);
    const data = req.body.data || [];
       console.log("DATA:", data);
    const result = processHierarchy(data);
      console.log("RESULT:", JSON.stringify(result, null, 2));
    res.status(200).json({
      user_id: "Leeza_04112005",
      email_id: "leeza0643.be23@chitkara.edu.in",
      college_roll_number: "2310990643",
      ...result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all route to serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});