import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartItems: { type: Object, default: {} },
    // ADDED: Allocate permanent address storage string
    address: { type: String, default: "" }
}, { minimize: false });

const user = mongoose.models.user || mongoose.model('user', userschema);

export default user;