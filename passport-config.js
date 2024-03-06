import { authenticateCustomer } from "./controllers/customerController"
import LocalStrategy from "passport-local"

const localStrategy = LocalStrategy.Strategy 



export function initialize(passport) { 

    

    passport.use(new localStrategy({

        usernameField: "email"

    }, authenticateCustomer))
    
    
    passport.serializeCustomer((customer, done) => { })
    passport.deserializeCustomer((id, done) => { })

}