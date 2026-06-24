const express = require("express");
const cors = require("cors");

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

app.listen(3000, () => {
  console.log("Server running on port 3000");
});