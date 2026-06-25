import {
    Authenticate,
    createUser,
    findUserByEmail,
    getCatByQrCode,
    getCatById,
    createEmergencyEvent,
    getEmergencyEventById,
    getGuardiansByOwner,
    assignGuardianToEvent,
} from "./persistance.js";
import bcrypt from "bcryptjs";

async function login(email, password) {
    return await Authenticate(email, password);
}

async function registerUser({ name, email, password, phone }) {
    const existing = await findUserByEmail(email);
    if (existing) {
        throw new Error("Email already registered");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    return createUser({ name, email, passwordHash, phone });
}

async function handleScan(qrCodeId) {
    const cat = await getCatByQrCode(qrCodeId);
    if (!cat) {
        throw new Error("Invalid Emergency ID. Please try again.");
    }
    const eventId = await createEmergencyEvent({ qrCodeId, catId: cat._id });
    return { cat, eventId };
}

async function getEmergencyView(eventId) {
    const event = await getEmergencyEventById(eventId);
    if (!event) {
        throw new Error("Emergency event not found.");
    }
    const cat = await getCatById(event.catId);
    const guardians = await getGuardiansByOwner(cat.ownerId);
    return { event, cat, guardians };
}

async function claimGuardian(eventId, guardianId) {
    return assignGuardianToEvent(eventId, guardianId);
}

export { login, registerUser, handleScan, getEmergencyView, claimGuardian };
