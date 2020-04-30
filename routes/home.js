const router = require('express').Router();
const verifyToken = require('./verifyToken');

router.get('/', verifyToken, (req, res)=>{
    console.log('/home', req.user);
    res.json({
        data: {
            title: 'Welcome! You are at Home',
            desc: 'sdsdfsdfdsf dsf dsf dsf sd f dsfsdf dsf sd f sdsd f'
        }
    })
});

module.exports = router;