require('@dotenvx/dotenvx').config()
const express=require('express')
const path=require("path")
const cors=require('cors')
const reportRouter=require('./report')
const logMiddleware=require('./log')
const limitMiddleware=require('./limit')
const testReport=require('./test-report')
const app=express()
const PORT=process.env.PORT

app.use(express.json())

app.use(cors({
    origin: "*"
}));

// Serve the public folder OUTSIDE the server folder
app.use(express.static(path.join(__dirname, "..", "public")));

// Serve the website homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "website", "index.html"));
});

app.use('/api',logMiddleware,limitMiddleware,reportRouter)
app.use('/api',logMiddleware,limitMiddleware,testReport)

app.listen(PORT,()=>{
    console.log(`Server running on port: ${PORT}`)
})