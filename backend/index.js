const express=require("express");
const app=express();
const userLogin=require("./routes/user");
app.use(express.json());

app.use("/user",userLogin);

app.listen(5000,()=>{
    console.log("server active on port 5000!");
})
