// All the queries are performed

import pool from "../models/database.js"

export async function queryAllCustomers() { 

    const result = await pool.query("SELECT * FROM customers");
    const rows = result[0];

    return rows
}

export async function queryCustomerByEmail(email) {
    
    const [row] = await pool.query(`SELECT id, email, password FROM customers WHERE email = (?);`, [email]);

    return row[0];
}

export async function createCustomer(email, firstName, lastName, password) {
    
    await pool.query(`INSERT INTO customers (email, firstName, lastName, password) VALUES (?, ?, ?, ?);`, [email, firstName, lastName, password])
}

export async function updatePassword(newPassword, email) { 

    await pool.query("UPDATE customers SET password = (?) WHERE email = (?)", [newPassword, email]);
}

export async function deleteCustomerByEmail(email) { 

    await pool.query("DELETE from customers WHERE email = (?);", [email]);
}

export async function queryCustomerById(id) { 

    const [row] = await pool.query(`SELECT * FROM customers WHERE id = (?)`, [id])

    return row[0]
}