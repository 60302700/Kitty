import { login, registerUser, handleScan, getEmergencyView, claimGuardian } from "./business.js";

async function authenticateUser(email, password) {
    return await login(email, password);
}

export { authenticateUser, registerUser, handleScan, getEmergencyView, claimGuardian };
