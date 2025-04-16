const express=require("express");
const app=express();
const cors=require("cors");
const userLogin=require("./routes/user");
const transactions=require("./routes/sending_normal");
const get_qr=require("./routes/qr_generator");
const getHistory=require("./routes/getTransactions");
const getPendingReq=require("./routes/getPendingReq");
const getBalance=require("./routes/getbalance");

app.use(express.json());
app.use(cors());
app.use("/user",userLogin);
app.use("/transact",transactions);
app.use("/get_qr",get_qr);
app.use("/getHistory",getHistory);
app.use("/getPending",getPendingReq);
app.use("/getBalance",getBalance);

app.listen(5001,()=>{
    console.log("server active on port 5001!");
})
