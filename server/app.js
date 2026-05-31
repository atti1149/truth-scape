import dotenvx from '@dotenvx/dotenvx';
dotenvx.config();
import express from 'express'
import path from 'path'
import cors from 'cors'
import reportRouter from './report.js'
import logMiddleware from './log.js'
import limitMiddleware from './limit.js'
//const testReport=require('./test-report');
const app=express();
const PORT=process.env.PORT;

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(cors({
    origin: "*"
}));

// Serve the public folder OUTSIDE the server folder
app.use(express.static(path.join(__dirname, "..", "public")));

// Serve the website homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "website", "index.html"));
});

app.use('/api/wiki',logMiddleware,limitMiddleware,reportRouter);
//app.use('/api',logMiddleware,limitMiddleware,testReport);

app.listen(PORT,()=>{
    console.log(`Server running on port: ${PORT}`);
});