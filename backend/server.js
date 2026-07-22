const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


const db = mysql.createPool({

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

});


app.get("/", (req,res)=>{
    res.send("Backend API is running");
});


app.get("/employees",(req,res)=>{

    db.query(
        "SELECT * FROM employees",
        (err,result)=>{

            if(err){
                return res.status(500).json({
                    error:err.message
                });
            }

            res.json(result);

        }
    );

});


app.listen(3000,()=>{
    console.log("Server running on port 3000");
});
