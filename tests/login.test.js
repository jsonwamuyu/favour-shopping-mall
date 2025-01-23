const {login, showError} = require("../app")


// Mock localStorage for testing
class LocalStorageMock {
    constructor() {
        this.store = {};
    }
    getItem(key) {
        return this.store[key] || null;
    }
    setItem(key, value) {
        this.store[key] = String(value);
    }
    removeItem(key) {
        delete this.store[key];
    }
    clear() {
        this.store = {};
    }
}
global.localStorage = new LocalStorageMock();


describe("Login Validation", ()=>{
    it("Should return true for valid email and password", ()=>{
        const admin = [{email:"admin@example.com", password:"admin123"}]
        expect(login(admin, 'admin@example.com', 'admin123')).toBeTruthy() 
    })
})