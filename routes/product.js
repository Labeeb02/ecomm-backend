const router=require('express').Router();
const Product=require('../models/Product');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

//CREATE

router.post('/', verifyTokenAndAdmin, async (req,res)=>{
    const newProduct=new Product(req.body);
    try{
        const product=await newProduct.save();
        res.status(200).send(product);
    }
    catch(err){
        res.status(400).send(err);
    }
})


//UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req,res)=>{
    try{
        const product=await Product.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        res.status(200).send(product);
    }catch(err){
        res.status(400).send(err);
    }
})

//DELETE

router.delete('/:id', verifyTokenAndAdmin, async (req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).send("Product Deleted");
    }catch(err){
        res.status(400).send(err);
    }
})

//GET PRODUCT
router.get('/find/:id', async (req,res)=>{
    try{
        const product=await Product.findById(req.params.id);
        res.status(200).send(product);
    }catch(err){
        res.status(400).send(err);
    }
})

//GET ALL PRODUCTS
router.get('/', async (req,res)=>{
    const qNew=req.query.new;
    const qCategory=req.query.category;
    try{
        let products;
        
        if(qNew){
            products=await Product.find().sort({createdAt:-1}).limit(5);
        }else if(qCategory){
            products=await Product.find({
                categories:{
                    $in:[qCategory]
                }
            });
        }
        else{
            products=await Product.find();
        }
        res.status(200).send(products);
    }catch(err){
        res.status(400).send(err);
    }
})


module.exports=router;