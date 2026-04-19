function log(req,res,next){
    const token = req.headers["x-auth-token"];
    if (!token) return res.status(400).json({error:"Error: no Auth token provided"})
    const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim()
        || req.socket.remoteAddress
        || "no-ip";

    console.log(`Request by: ${token} at ${new Date().toISOString()} with method ${req.method} from IP ${ip}`);
    next()
}
export default log