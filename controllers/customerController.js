// All logic being performed

import bcrypt from "bcryptjs";

import {

    queryAllCustomers,
    queryCustomerByEmail,
    createCustomer,
    updatePassword,
    deleteCustomerByEmail

} from "../service/customerTable.js"

export const getAllCustomers = async (request, response) => { 

    const allCustomers = await queryAllCustomers();

    return response.status(200).json({ "status":"success", allCustomers }).end();
}

export const authenticateCustomer = async (email, password, done) => { 

    const customer = await queryCustomerByEmail(email);

    if (customer == undefined) {
        return done(null, false, {message: "Account Does Not Exist"});
        
    }
    if (!await bcrypt.compare(password, customer.password)) {
        return done(null, false, {message:"Password Does Not Match"});
    }

    return done(null, customer)
}

export const registerCustomer = async (request, response) => { 

    const customer = await queryCustomerByEmail(request.body.email);
    
    if (customer !== undefined) {
        response.status(400).json({"status":"failure", "reason":"Email is not Unique"}).end();
        return;
    }

    const hashedPassword = await bcrypt.hash(request.body.password, 10)
    await createCustomer(request.body.email, request.body.firstName, request.body.lastName, hashedPassword)    

    response.redirect("/customer/login")

}

export const changeCustomerPassword = async (request, response) => { 

    const customer = await queryCustomerByEmail(request.body.email);

    if (!await bcrypt.compare(request.body.password, customer.password)) {
        response.status(400).json({"status":"failure", "reason":"Password Does Not Match", customer}).end();
        return; 
    }

    const hashedPassword = await bcrypt.hash(request.body.newPassword, 10)
    await updatePassword(hashedPassword, request.body.email);

    return response.status(200).json( { "status":"success", customer}).end();
}

export const deleteCustomer = async (request, response) => { 

    const customer = await queryCustomerByEmail(request.body.email);

    if (!await bcrypt.compare(request.body.password, customer.password)) {
        response.status(400).json({"status":"failure", "reason":"Password Does Not Match", customer}).end();
        return;
    }

    await deleteCustomerByEmail(request.body.email);

    request.logout(function(err) {
        response.redirect("/customer/login");
    });
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