// All of the available routes

import express from "express";
import { logWarnings } from "../logger.js";

import {

    getAllCustomers,
    authenticateCustomer,
    registerCustomer,
    changeCustomerPassword,
    deleteCustomer

} from "../controllers/customerController.js";

const router = express.Router();
router.use(express.json())
router.use(logWarnings);
router.use(express.urlencoded({ extended: false }))

router.get("/all", getAllCustomers);

router.get("/login", (request, response) => { response.render("login.ejs")})
router.post("/login", authenticateCustomer);

router.get("/register", (request, response) => { response.render("register.ejs")})
router.post("/register", registerCustomer);

router.patch("/changePassword", changeCustomerPassword);
router.delete("/delete", deleteCustomer);

export default router