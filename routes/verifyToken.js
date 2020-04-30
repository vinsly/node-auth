const jwtToken = require('jsonwebtoken');

module.exports =  function(req, res, next){
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send('access denied');
    }
    try{
        const verify = jwtToken.verify(token, process.env.TOKEN_SECRET);
        console.log('verify', verify);
        req.user = verify;
        next();
    }
    catch(err){
        res.status(401).send('Invalid token');
    }
}