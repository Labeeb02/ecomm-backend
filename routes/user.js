const User=require('../models/User');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

const router=require('express').Router();


router.put('/:id', verifyTokenAndAuthorization, async (req,res)=>{
    if(req.body.password)
    {
        req.body.password=CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }
    try{
        const user=await User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        res.status(200).send(user);
    }catch(err){
        res.status(400).send(err);
    }
})

//DELETE

router.delete('/:id', verifyTokenAndAuthorization, async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send("User Deleted");
    }catch(err){
        res.status(400).send(err);
    }
})

//GET USER
router.get('/find/:id', verifyTokenAndAdmin, async (req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        const {password, ...userData}=user.toObject();
        res.status(200).send(userData);
    }catch(err){
        res.status(400).send(err);
    }
})

//GET ALL USERS
router.get('/', verifyTokenAndAdmin, async (req,res)=>{
    const query=req.query.new;
    try{
        const users=query ? await User.find().sort({_id:-1}).limit(5) : await User.find();
        res.status(200).send(users);
    }catch(err){
        res.status(400).send(err);
    }
})

//GET USER STATS
router.get('/stats', verifyTokenAndAdmin, async (req,res)=>{
    const date=new Date();
    const lastYear=new Date(date.setFullYear(date.getFullYear()-1));

    try{
        const data=await User.aggregate([
            {
                $match:{
                    createdAt:{
                        $gte:lastYear//greater than equal to last year
                    }
                }
            },
            {
                $project:{
                    month:{
                        $month:'$createdAt'//get the month from createdAt
                    }
                }
            },
            {
                $group:{
                    _id: "$month",
                    total: {$sum: 1}
                }
            }
        ]);
        res.status(200).send(data);
    }catch(err){
        res.status(400).send(err);
    }
})

module.exports=router;