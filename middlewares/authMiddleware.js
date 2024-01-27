const jwt = require("jsonwebtoken")

const isAuthenticated = async (req, resp, next)=>{
    const token = req.headers['authorization']
    if(!token)
    {
        resp.status(401).send({'status':'error', 'message':"Unauthorized - Missing Token'"})
        return
    }

    try {
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return resp.status(401).json({ status: 'error', message: 'Unauthorized - Invalid Token' });
    }
}

module.exports = {
    isAuthenticated
}