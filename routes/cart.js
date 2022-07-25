const router=require('express').Router();
const Cart=require('../models/Cart');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

//CREATE

router.post('/', verifyToken, async (req,res)=>{
    const newCart=new Cart(req.body);
    try{
        const cart=await newCart.save();
        res.status(200).send(product);
    }
    catch(err){
        res.status(400).send(err);
    }
})


//UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req,res)=>{
    try{
        const cart=await Cart.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        res.status(200).send(cart);
    }catch(err){
        res.status(400).send(err);
    }
})

//DELETE

router.delete('/:id', verifyTokenAndAuthorization, async (req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).send("Cart Deleted");
    }catch(err){
        res.status(400).send(err);
    }
})

//GET CART
router.get('/find/:id',verifyTokenAndAuthorization, async (req,res)=>{
    try{
        const cart=await Cart.findOne({userId:req.params.id});
        res.status(200).send(cart);
    }catch(err){
        res.status(400).send(err);
    }
})

//GET ALL 
router.get('/',verifyTokenAndAdmin, async (req,res)=>{
    try{
        const carts=await Cart.find();
        res.status(200).send(carts);
    }
    catch(err){
        res.status(400).send(err);
    }
})


module.exports=router;