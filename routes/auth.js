const router=require('express').Router();
const User=require('../models/User');
const CryptoJS=require('crypto-js');
const jwt=require('jsonwebtoken');
//Register
router.post('/register', async (req,res)=>{
    const newUser=new User({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString()
    });

    try{
        const user=await newUser.save();
        res.status(201).send(user);
    }catch(err){
        res.status(400).send(err);
    }
})

router.post('/login', async (req,res)=>{
    try{
        const user=await User.findOne({username:req.body.username});
        if(!user)
        {
            res.status(404).send('Wrong Credentials')
        }
        else{
            const decrypted=CryptoJS.AES.decrypt(
                user.password,
                process.env.PASS_SEC
            ).toString(CryptoJS.enc.Utf8);
            if(decrypted===req.body.password){         
                const accessToken=jwt.sign({_id:user._id,isAdmin:user.isAdmin},process.env.JWT_SEC,{expiresIn:'1h'});
                
                const {password, ...userData}=user.toObject();
                
                res.status(200).send({...userData,accessToken});
            }
            else{
                res.status(404).send('Wrong Credentials')
            }
        }
        
    }catch(err){
        res.status(400).send(err);
    }
})

module.exports=router;