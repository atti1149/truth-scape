import express from 'express'
const router = express.Router();

//ONLY USE THIS IF YOU NEED TO TEST THAT THE FRONT-END IS CONNECTING PROPERLY
router.post("/test-report", async (req, res) => {

  const reportObj = {
    classification: "worked",
    summary: "worked",
    redFlags: "worked",
    score: 100
  };

  res.json(reportObj);
});

export default express;
