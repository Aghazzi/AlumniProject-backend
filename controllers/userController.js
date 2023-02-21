import { response } from "express";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

class Controller {
    getAll(req, res, next) {
        if (req.user.role === "admin") {
            User.find({}, (err, response) => {
                if (err) return next(err);
                res.status(200).send({ success: true, response });
            });
        } else {
            res.status(200).send("You're not Authorized");
        }
    }
    get(req, res, next) {
        if (req.user.role === "admin") {
            let { id } = req.params;
            User.findOne({ _id: id }, (err, response) => {
                if (err) return next(err);
                res.status(200).send({ success: true, response });
            });
        } else {
            res.status(200).send("You're not Authorized");
        }
    }
    signUp = async (req, res) => {
        try {
            const {
                fullName,
                phoneNumber,
                email,
                password,
                city,
                street,
                role,
            } = req.body;
            if (
                !(
                    email &&
                    password &&
                    fullName &&
                    city &&
                    street &&
                    phoneNumber
                )
            ) {
                return res.status(400).send("All input is required");
            }
            const oldUser = await User.findOne({ email });
            if (oldUser) {
                return res.status(409).send("User Already Exist. Please Login");
            }
            let encryptedUserPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                fullName: fullName,
                city: city,
                street: street,
                phoneNumber: phoneNumber,
                email: email.toLowerCase(),
                password: encryptedUserPassword,
                role: role,
            });
            const token = jwt.sign(
                { user_id: user._id, email, role: user.role },
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h",
                }
            );
            res.cookie("access-token", token, {
                maxAge: 2 * 60 * 60 * 1000,
                httpOnly: true,
            });
            user.token = token;
            res.status(201).json(user);
        } catch (err) {
            console.log(err);
        }
    };
    patch = async (req, res) => {
        try {
            let { id } = req.params;
            let body = req.body;
            const { password } = req.body;
            if (password) {
                let encryptedUserPassword = await bcrypt.hash(password, 10);
                req.body.password = encryptedUserPassword;
            }
            const user = await User.findOneAndUpdate({ _id: id }, body, {
                new: true,
            });
            if (!user) return res.status(404).send("id not found");
            res.status(200).send({ success: "User updated", user });
        } catch (err) {
            res.status(500).send(err.message);
        }
    };
    delete(req, res, next) {
        if (req.user.role === "admin") {
            let { id } = req.params;
            User.findByIdAndDelete({ _id: id }, (err, response) => {
                if (err) return next(err);
                res.status(200).send({ succes: true, response });
            });
        } else {
            res.status(200).send("You're not Authorized");
        }
    }
    logIn = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            const validatePass = await bcrypt.compare(password, user.password);
            const token = generateToken(user._id, user.role);
            if (user && validatePass) {
                res.cookie("access-token", token, {
                    maxAge: 2 * 60 * 60 * 1000,
                    httpOnly: true,
                }).send({
                    _id: user.id,
                    email: user.email,
                    role: user.role,
                    token,
                });
            } else {
                res.status(400);
                throw new Error("Incorrect information");
            }
        } catch (error) {
            res.status(401).send({ succes: false, error });
        }
    };
    logOut(req, res, next) {
        res.clearCookie("access-token");
        return res.send("logged out successfully!");
    }
}

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "2h",
    });
};

const controller = new Controller();
export default controller;
