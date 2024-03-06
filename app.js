import express from "express";
import customerRoute from "./routes/customer.js"

const app = express();

app.use("/customer", customerRoute);

app.set("view-engine", "ejs");

app.listen(8080, () => {
    
    console.log("Server listening on port 8080....")});

export default app