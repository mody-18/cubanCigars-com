// All of the available routes

import express from "express";
import initializePassport from "../passport-config.js" 
import passport from "passport"
import flash from "express-flash";
import session from "express-session";
import dotenv from "dotenv"
import { logWarnings } from "../logger.js";
import methodOverride from "method-override"

import {

    getAllCustomers,
    registerCustomer,
    changeCustomerPassword,
    deleteCustomer,
    checkAuthenticated,
    checkNotAuthenticated,
    logCustomerOut,
    
    renderIndexEJS,
    renderRegisterEJS,
    renderSettingsEJS,
    renderLoginEJS,

} from "../controllers/customerController.js";

dotenv.config()
const router = express.Router();
router.use(express.json())
router.use(logWarnings);
router.use(express.urlencoded({ extended: false }))
router.use(flash())
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride("_method"));

initializePassport(passport)

router.get("/all", checkAuthenticated, getAllCustomers);

router.get("/", checkAuthenticated, renderIndexEJS)

router.get("/login", checkNotAuthenticated, renderLoginEJS)
router.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/customer/",
    failureRedirect: "/customer/login",
    failureFlash: true
}));

router.get("/register", checkNotAuthenticated, renderRegisterEJS)
router.post("/register", checkNotAuthenticated, registerCustomer);

router.get("/settings", checkAuthenticated, renderSettingsEJS)

router.post("/changePassword", checkAuthenticated, changeCustomerPassword);
router.post("/delete", checkAuthenticated, deleteCustomer)

router.post("/logout", logCustomerOut)
export default router

