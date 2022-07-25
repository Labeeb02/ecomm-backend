const router=require('express').Router();
const Order=require('../models/Order');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

//CREATE

router.post('/', verifyToken, async (req,res)=>{
    if(req.body.userId==req.user._id)
    {
        const newOrder=new Order(req.body);
        try{
            const order=await newOrder.save();
            res.status(200).send(order);
        }
        catch(err){
            res.status(400).send(err);
        }
    }
    else
    {
        res.status(401).send('Not Authorized');
    }
    
})


//UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req,res)=>{
    try{
        const order=await Order.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        res.status(200).send(order);
    }catch(err){
        res.status(400).send(err);
    }
})

//DELETE

router.delete('/:id', verifyTokenAndAdmin, async (req,res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).send("Order Deleted");
    }catch(err){
        res.status(400).send(err);
    }
})

//GET USER ORDERS
router.get('/find/:id',verifyTokenAndAuthorization, async (req,res)=>{
    try{
        const orders=await Order.find({userId:req.params.id});
        res.status(200).send(orders);
    }catch(err){
        res.status(400).send(err);
    }
})

//GET ALL 
router.get('/',verifyTokenAndAdmin, async (req,res)=>{
    try{
        const orders=await Order.find();
        res.status(200).send(orders);
    }
    catch(err){
        res.status(400).send(err);
    }
})

//GET MONTHLY INCOME

router.get('/income',verifyTokenAndAdmin, async (req,res)=>{
    const date=new Date();
    const lastMonth=new Date(date.setMonth(date.getMonth()-1));
    const previousMonth=new Date(date.setMonth(lastMonth.getMonth()-2));

    try{
        const income=await Order.aggregate([
            {$match:
                {
                    createdAt:
                    {
                        $gte:previousMonth
                    }
                }
            },
            {$project:
                {
                    month:{
                        $month:'$createdAt'
                    },
                    sales:'$amount'
                }
            },
            {$group:
                {
                    _id:'$month',
                    total:{$sum:'$sales'}
                }
            }
        ]);
        res.status(200).send(income);
    }catch(err){
        res.status(400).send(err);
    }

})

module.exports=router;