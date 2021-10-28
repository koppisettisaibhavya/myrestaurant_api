const express=require("express")
const app=express() 
const cors=require("cors")
app.use(cors({
    origin:"*"
}))
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongodb=require("mongodb")
const mongoclient=mongodb.MongoClient;
const url="mongodb+srv://bhavy:bhavya2000@cluster0.0bfdg.mongodb.net/resta?retryWrites=true&w=majority";
app.use(express.json())
app.post("/",function(req,res){
    res.json({
        msg:req.body
    })
})
function authenticate_user(req, res, next) {
    // Check is the token is present in header
    if (req.headers.authorization) {
        // Check if the token is valid
        let valid = jwt.verify(req.headers.authorization, "}QF_w,(<u7BBt>V}");
        if (valid) {
            // if valid all next()
            req.userid = valid.id
            next();
        } else {
            res.status(401).json({
                message: "Unauthorized"
            })
        }
    } else {
        res.status(401).json({
            message: "Unauthorized"
        })
    }

}
function authenticate_admin(req, res, next) {
    // Check is the token is present in header
    if (req.headers.authorization) {
        // Check if the token is valid
        let valid = jwt.verify(req.headers.authorization, "}QF_w,(<u7BBt>V}");
        if (valid) {
            // if valid all next()
            //req.userid = valid.id
            next();
        } else {
            res.status(401).json({
                message: "Unauthorized"
            })
        }
    } else {
        res.status(401).json({
            message: "Unauthorized"
        })
    }

}
app.post("/user/register", async function (req, res) {
    try {
        // Open the Connection
        let connection = await mongoclient.connect(url)

        // Select the DB
        let db = connection.db("resta")

        let salt = await bcryptjs.genSalt(10)
        let hash = await bcryptjs.hash(req.body.password, salt);

        req.body.password = hash;

        // Select the collection
        // Do operation (Create,Read,update,Delete)
        await db.collection('user').insertOne(req.body)

        res.json({
            message: "User Created"
        })
    } catch (error) {
        console.log(error)
    }
})
app.post("/user/login", async function (req, res) {
    try {
        // Open the Connection
        let connection = await mongoclient.connect(url)

        // Select the DB
        let db = connection.db("resta")

        // Find the user doc with email id
        let user = await db.collection("user").findOne({ email: req.body.email });

        if (user) {
            // Encrypt the given password with user doc password
            let result = await bcryptjs.compare(req.body.password, user.password);
            // Compare both password
            // if both are same
            if (result) {
                // Generate JWT Token
                let token = jwt.sign({
                    id: user._id,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60)
                }, "}QF_w,(<u7BBt>V}")
                res
                    // .cookie("access_token", token, {
                    //     httpOnly: true
                    // })
                    .status(200)
                    .json({
                        message: "Success",
                        token
                    })
            } else {
                res.status(401).json({
                    message: "Username/Password is worng"
                })
            }
            // loggin the user
        } else {
            res.status(401).json({
                message: "Username/Password is worng"
            })
        }


    } catch (error) {
        console.log(error)
    }
})
app.post("/admin/register", async function (req, res) {
    try {
        // Open the Connection
        let connection = await mongoclient.connect(url)

        // Select the DB
        let db = connection.db("resta")

        let salt = await bcryptjs.genSalt(10)
        let hash = await bcryptjs.hash(req.body.password, salt);

        req.body.password = hash;

        // Select the collection
        // Do operation (Create,Read,update,Delete)
        await db.collection('admin').insertOne(req.body)

        res.json({
            message: "Admin Created"
        })
    } catch (error) {
        console.log(error)
    }
})
app.post("/admin/login", async function (req, res) {
    try {
        // Open the Connection
        let connection = await mongoclient.connect(url)

        // Select the DB
        let db = connection.db("resta")

        // Find the user doc with email id
        let user = await db.collection("admin").findOne({ email: req.body.email });

        if (user) {
            // Encrypt the given password with user doc password
            let result = await bcryptjs.compare(req.body.password, user.password);
            // Compare both password
            // if both are same
            if (result) {
                // Generate JWT Token
                let token = jwt.sign({
                    id: user._id,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60)
                }, "}QF_w,(<u7BBt>V}")
                res
                    // .cookie("access_token", token, {
                    //     httpOnly: true
                    // })
                    .status(200)
                    .json({
                        message: "Success",
                        token
                    })
            } else {
                res.status(401).json({
                    message: "Username/Password is worng"
                })
            }
            // loggin the user
        } else {
            res.status(401).json({
                message: "Username/Password is worng"
            })
        }


    } catch (error) {
        console.log(error)
    }
})
app.post("/additem",authenticate_admin,async function(req,res){

    try{
        let conn=await mongoclient.connect(url);
        const db=conn.db("resta")
        console.log("&*")
        await db.collection("items").insertOne(req.body)
        console.log("&*")
        await conn.close()
        res.json({
            msg:"success"
        })
    }
    catch(err)
    {
        res.status(500).json({
            msg:"error"
        })
    }
})
app.get('/getitem/:type',authenticate_admin,async function(req,res){
    console.log("resu")
    try{
        let conn=await mongoclient.connect(url);
        let db=conn.db("resta")
        let resu=await db.collection("items").find({item_type:req.params.type}).toArray()
        if(resu)
        {//console.log(resu)
            res.json(resu)
        }
        else{
            res.json({})
        }
    }
    catch(err)
    {
        res.status(500).json({
            msg:"error"
        })
    }
})

app.get('/getitemid/:id',authenticate_admin,async function(req,res){

    try{
        let conn=await mongoclient.connect(url);
        let db=conn.db("resta")
        let resu=await db.collection("items").findOne({_id:mongodb.ObjectId(req.params.id)})
        if(resu)
        {
            res.json(resu)
        }
        else{
            res.json({})
        }
    }
    catch(err)
    {
        res.status(500).json({
            msg:"error"
        })
    }
})
app.put('/edititem/:id',authenticate_admin,async function(req,res){

    try{
        let conn=await mongoclient.connect(url);
        let db=conn.db("resta")
        //console.log(req.body)
        await db.collection("items").findOneAndUpdate({_id:mongodb.ObjectId(req.params.id)},{$set:req.body})
        
            res.json({msg:"success"})
    
    }
    catch(err)
    {
        res.status(500).json({
            msg:"error"
        })
    }
})
app.delete('/deleteitem/:id',authenticate_admin,async function(req,res){

    try{
        let conn=await mongoclient.connect(url);
        let db=conn.db("resta")
        await db.collection("items").findOneAndDelete({_id:mongodb.ObjectId(req.params.id)})
            res.json({msg:"success"})
    
    }
    catch(err)
    {
        res.status(500).json({
            msg:"error"
        })
    }
})
app.get('/getitem1/:type',authenticate_user,async function(req,res){
    console.log("resu")
    try{
        let conn=await mongoclient.connect(url);
        let db=conn.db("resta")
        let resu=await db.collection("items").find({item_type:req.params.type}).toArray()
        if(resu)
        {//console.log(resu)
            res.json(resu)
        }
        else{
            res.json({})
        }
    }
    catch(err)
    {
        res.status(500).json({
            msg:"error"
        })
    }
})
app.post("/user/storeorder",authenticate_user,async function(req,res){

    try{
        let conn=await mongoclient.connect(url);
        const db=conn.db("resta")
        //console.log("&*")
        await db.collection("orders").insertOne(req.body)
        //console.log("&*")
        await conn.close()
        res.json({
            msg:"success"
        })
    }
    catch(err)
    {
        res.status(500).json({
            msg:"error"
        })
    }
})
app.get("/user/getorders/:email",authenticate_user,async function(req,res){

    try{
        let conn=await mongoclient.connect(url);
        const db=conn.db("resta")
        //console.log("&*")
        let resu=await db.collection("orders").find({email : req.params.email}).toArray()

        //console.log("&*")
        await conn.close()
        res.json(resu)
    }
    catch(err)
    {
        res.status(500).json({
            msg:"error"
        })
    }
})
app.listen(process.env.PORT || 3000, function () {
    console.log(`Server is running in PORT ${process.env.PORT || 3000}`)
})