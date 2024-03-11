import LocalStrategy from "passport-local"

import { 

    authenticateCustomer 

} from "./controllers/customerController.js"
import { queryCustomerByEmail, queryCustomerById } from "./service/customerTable.js"

const localStrategy = LocalStrategy.Strategy

export default async function initialize(passport) { 

    passport.use(new localStrategy( {usernameField: "email"}, authenticateCustomer))

    passport.serializeUser((customer, done) => {        
        done(null, customer.id)
    })
    passport.deserializeUser((id, done) => { 
        return done(null, queryCustomerById(id)) 
    })
}