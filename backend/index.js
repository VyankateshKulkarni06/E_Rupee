const express=require("express");
const app=express();
const userLogin=require("./routes/user");
const transactions=require("./routes/sending_normal");

app.use(express.json());

app.use("/user",userLogin);
app.use("/transact",transactions);

app.post("/",(req,res)=>{
    res.json({msg:"Hello"});
})
app.listen(5001,()=>{
    console.log("server active on port 5000!");
})
