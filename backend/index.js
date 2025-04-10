const express=require("express");
const app=express();
const userLogin=require("./routes/user");
const transactions=require("./routes/sending_normal");

app.use(express.json());

app.use("/user",userLogin);
app.use("/transact",transactions);


app.listen(5000,()=>{
    console.log("server active on port 5000!");
})
