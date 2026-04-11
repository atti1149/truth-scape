const express = require('express');
const router = express.Router();

router.post("/test-report", async (req, res) => {

  const reportObj = {
    classification: "worked",
    summary: "worked",
    redFlags: "worked",
    score: 100
  };

  res.json(reportObj);
});

module.exports = router;
