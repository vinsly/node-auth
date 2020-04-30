const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwtToken = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../routes/validation');

router.post('/register', async (req, res)=>{
    //Lets vallidate the data
    const {error} = registerValidation(req.body);
    if(error){
        return res.status(400).send(error.details);
    }

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist){
        return res.status(400).send("Email already exist");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPwd
    });
    try{
        const savedUser = await user.save();
        res.send({user: savedUser._id});
    }catch(err){
        res.status(400).send(err)
    }
});

router.post('/login', async (req, res)=>{
    
    const {error} = loginValidation(req.body);
    if(error){
        return res.status(400).send(error.details);
    }
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(400).send("Email or password wrong");
    }
    const validPwd = await bcrypt.compare(req.body.password, user.password);
    if(!validPwd){
        return res.status(400).send("Email or password wrong");
    }
    //create token
    const token = jwtToken.sign({
        _id: user.id,
        userName: user.name
    }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;