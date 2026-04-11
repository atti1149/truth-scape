const rateLimit=require('express-rate-limit')
const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 15 minutes
    limit: 10, 
    keyGenerator: (req) => req.headers["x-auth-token"] || "no-token",
    message: { 
        error: "Too many requests",
        retryAfter:"15 minutes"
    }
})
module.exports=limiter;