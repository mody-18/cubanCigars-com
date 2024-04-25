import express from "express";
import customerRoute from "./routes/customer.js"

const app = express();

app.use(express.static('public'));
app.use("/customer", customerRoute);


app.set("view-engine", "ejs");

const PORT = process.env.PORT || 8080; 
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}....`);
});

export default app