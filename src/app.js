const express = require('express');


const app = express();


app.use("/test", (req, res) => {
    
    res.send("Request from url cdd");
    
})

app.listen(3000, () =>{
    console.log("Server is running");
})