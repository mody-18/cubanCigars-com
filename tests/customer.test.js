import request from "supertest";
import app from "../app.js"; 

describe("GET /customer/all", () => {

    describe("given endpoint is called", () => {

        it("should return json content type header", async () => { 

            const response = await request(app).get("/customer/all")

            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));

        })

        it("response contains all customers object", async () => { 

            const response = await request(app).get("/customer/all");

            expect(response.body.allCustomers).toBeDefined();

        })

        it ("should respond with a 200 status code", async () => { 

            const response = await request(app).get("/customer/all");

            expect(response.statusCode).toBe(200);

        })
    })
})

describe("POST /customer/login", () => { 

    describe("given a valid email and password", () => { 

        it("response contains customer object", async () => { 

            const response = await request(app).post("/customer/login").send({
                email:"test@gmail.com",
                password:"password"
            });

            expect(response.body.customer).toBeDefined();

        })

        it("should respond with a 200 status code", async () => { 

            const response = await request(app).post("/customer/login").send({
                email:"test@gmail.com",
                password:"password"
            });

            expect(response.statusCode).toBe(200);

        })
    })

    describe("given an invalid email or password", () => { 

        it("should respond with a 400 status code", async () => { 

            const bodyData = [
                {email:""},
                {email:"test@gmail.com", password:""}
            ]

            for (const body of bodyData) {
                const response = await request(app).post("/customer/login").send(body);
                expect(response.statusCode).toBe(400);
            }
            
        })
    })
})

describe("POST customer/register", () => { 

    describe("given a unique email & password", () => { 

        it("should respond with a 200 status code", async () => { 
        
            const response = await request(app).post("/customer/register").send({
                email:"test2@gmail.com",
                firstName:"test",
                lastName:"test",
                password:"password"
            })

            expect(response.statusCode).toBe(200);

        })
    })
    
    describe("given a non-unique email & password", () => { 

        it("should respond with a 400 status code", async () => { 

            const response = await request(app).post("/customer/register").send({
                email:"test2@gmail.com",
                firstName:"test",
                lastName:"test",
                password:"password"
            })

            expect(response.statusCode).toBe(400);

        })
    })
})

describe("PATCH /customer/changePassword", () => { 

    describe("given a valid current password", () => { 

        it("should respond with a 200 status code", async () => { 

            const response = await request(app).patch("/customer/changePassword").send({
                email:"test2@gmail.com",
                password:"password",
                newPassword:"pass"
            })  

            expect(response.statusCode).toBe(200);
        })
    })

    describe("given a non-valid current password", () => { 

        it("should respond with a 400 status code", async () => { 

            const response = await request(app).patch("/customer/changePassword").send({
                email:"test2@gmail.com",
                password:"password",
                newPassword:"password123"
            })

            expect(response.statusCode).toBe(400);
            
        })
    })
})

describe("DELETE /customer/delete", () => { 

    describe("given a non-valid password", () => { 

        it("should respond with a 400 status code", async () => { 

            const response = await request(app).delete("/customer/delete").send({
                email:"test2@gmail.com",
                password:"password"
            })

            expect(response.statusCode).toBe(400);

        })
    })

    describe("given a valid password", () => {

        it("should respond with a 200 status code", async () => {

            const response = await request(app).delete("/customer/delete").send({
                email:"test2@gmail.com",
                password:"pass"
            })

            expect(response.statusCode).toBe(200);

        })
    })
})
