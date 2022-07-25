const jwt=require('jsonwebtoken');

const verifyToken=async (req,res,next)=>{
    const authHeader=req.headers.token;
    if(authHeader)
    {
        const token=authHeader.split(' ')[1];
        jwt.verify(token,process.env.JWT_SEC,(err,decoded)=>{
            if(err)
            {
                res.status(401).send('Invalid Token');
            }
            else
            {
                req.user=decoded;
                next();
            }
        })
    }
    else
    {
        res.status(401).send('Not Authorized');
    }
}

const verifyTokenAndAuthorization=async (req,res,next)=>{
    verifyToken(req,res,async ()=>{
        if(req.user._id===req.params.id || req.user.isAdmin)
        {
            next();
        }
        else
        {
            res.status(401).send('Not Authorized');
        }
    })
}

const verifyTokenAndAdmin=async (req,res,next)=>{
    verifyToken(req,res,async ()=>{
        if(req.user.isAdmin)
        {
            next();
        }
        else
        {
            res.status(401).send('Not Authorized');
        }
    })
}

module.exports={
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
};

