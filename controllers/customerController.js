// All logic being performed

import bcrypt from "bcryptjs";

import {

    queryAllCustomers,
    queryCustomerByEmail,
    createCustomer,
    updatePassword,
    deleteCustomerByEmail

} from "../service/customerTable.js"

import initializePassport from "../passport-config.js"
import passport from "passport";

initializePassport(passport)

// export const errorHandler = async (error, request, response, next) => { 
//     if (error) { 
//         response.send("<h1>There was an error, please try again</h1>")
//     }
// }

export const getAllCustomers = async (request, response) => { 

    const allCustomers = await queryAllCustomers();

    return response.status(200).json({ "status":"success", allCustomers }).end();
}

export const authenticateCustomer = async (request, response) => { 

    const customer = await queryCustomerByEmail(request.body.email);

    // 

    if (customer == undefined) {
        response.status(400).json({"status":"failure", "reason":"Account Does Not Exist", customer}).end();

        return;
        
    }
    if (!await bcrypt.compare(request.body.password, customer.password)) {
        response.status(400).json({"status":"failure", "reason":"Password Does Not Match", customer}).end();
        return;
    }

    return response.status(200).json({ "status": "success", customer}).end()
}

export const registerCustomer = async (request, response) => { 

    console.log(`Email: ${request.body.email}`)
    console.log(`Password: ${request.body.password}`)

    const customer = await queryCustomerByEmail(request.body.email);
    
    if (customer !== undefined) {
        response.status(400).json({"status":"failure", "reason":"Email is not Unique"}).end();
        return;
    }

    const hashedPassword = await bcrypt.hash(request.body.password, 10)
    await createCustomer(request.body.email, request.body.firstName, request.body.lastName, hashedPassword)    

    response.redirect("/customer/login");
    // return response.status(200).json({ "status":"success", "customer": { "email": request.body.email, "firstName": request.body.firstName, "lastName": request.body.lastName, "password": hashedPassword} }).end();
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

    return response.status(200).json({ "status":"success", customer}).end();
}