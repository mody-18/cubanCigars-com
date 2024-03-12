// All logic being performed

import bcrypt from "bcryptjs";

import {

    queryAllCustomers,
    queryCustomerByEmail,
    createCustomer,
    updatePassword,
    deleteCustomerByEmail,
    queryCustomerById

} from "../service/customerTable.js"

export const getAllCustomers = async (request, response) => { 

    const allCustomers = await queryAllCustomers();

    return response.status(200).json({ "status":"success", allCustomers }).end();
}

export const authenticateCustomer = async (email, password, done) => { 

    const customer = await queryCustomerByEmail(email);

    if (customer == undefined) {
        return done(null, false, {status: "error", error_code: 404, message: "Account Does Not Exist"});
        
    }
    if (!await bcrypt.compare(password, customer.password)) {
        return done(null, false, {status: "error", error_code: 404, message:"Password Does Not Match"});
    }

    return done(null, customer)
}

export const registerCustomer = async (request, response) => { 

    const customer = await queryCustomerByEmail(request.body.email);
    
    if (customer !== undefined) {
        response.status(400).json({status: "error", error_code: 404, message:"Email is not Unique"}).end();
        return;
    }

    const hashedPassword = await bcrypt.hash(request.body.password, 10)
    await createCustomer(request.body.email, request.body.firstName, request.body.lastName, hashedPassword)    

    response.redirect("/customer/login")

}

export const changeCustomerPassword = async (request, response) => { 

    const id = (await request.user).id

    const customer = await queryCustomerById(id);

    if (!await bcrypt.compare(request.body.password, customer.password)) {
        response.status(400).json({"status":"failure", "reason":"Password Does Not Match", customer}).end();
        return; 
    }

    if (!(request.body.newPassword == request.body.confirmNewPassword)) { 
        response.status(400).json({"status":"failure", "reason":"New Password & Confirm New Password Do Not Match", customer}).end
        return;
    }

    const hashedPassword = await bcrypt.hash(request.body.newPassword, 10)
    await updatePassword(hashedPassword, customer.email);

    return response.status(200).json( { "status":"success", customer}).end();
}

export const deleteCustomer = async (request, response) => {
    
    const id = (await request.user).id

    const customer = await queryCustomerById(id);

    if (!await bcrypt.compare(request.body.password, customer.password)) {
        response.status(400).json({"status":"failure", "reason":"Password Does Not Match"}).end();
        return;
    }

    await deleteCustomerByEmail(customer.email);

    request.logout(function(err) {
        response.redirect("/customer/login");
    });
    
}

export const renderLoginEJS = async (request, response) => {

    response.render("login.ejs") 
        
}

export const renderIndexEJS = async (request, response) => {
    
    const name = (await request.user).firstName + " " +  (await request.user).lastName;
    
    response.render("index.ejs", { name: name })
    
}

export const renderRegisterEJS = async (request, response) => { 
        
    response.render("register.ejs")

}

export const renderSettingsEJS = async (request, response) => {
    
    response.render("settings.ejs")

}

export const checkAuthenticated = (request, response, next) => { 

    if (request.isAuthenticated()) { 
        return next();
    }
    response.redirect("/customer/login")
}

export const checkNotAuthenticated = (request, response, next) => { 

    if (request.isAuthenticated()) { 
        response.redirect("/customer/")
    }
    next();
}

export const logCustomerOut = (request, response) => {
    request.logout(function(err) {
        response.redirect("/customer/login");
    });
};