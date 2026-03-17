require('@dotenvx/dotenvx').config()
const express=require('express')
const path=require("path")
const cors=require('cors')
const reportRouter=require('./report')
const app=express()
const PORT=process.env.PORT

app.use(express.json())

app.use(cors({
    origin: "*"
}));

app.use(express.static("public"));

// Make "/" load the website homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/website/index.html"));
});

app.use('/api',reportRouter)

app.listen(PORT,()=>{
    console.log(`Server running on port: ${PORT}`)
})