import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

const config = process.env;

const verifyUser = (req, res, next) => {
    let token;

    token = req.cookies["access-token"] || req.headers["access-token"];
    // console.log(token);

    if (!token) {
        return res.status(403).send("Log in Please!");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(req.user);
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

export default verifyUser;

export function admin(req, res, next) {
    if (req.user.role === "admin") return next();
    else return res.status(401).send("Not Authorized");
}

const path = "upload";
// cb = callback
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path);
    },
    filename: (req, file, cb) => {
        cb(
            null,
            `${Date.now()}-${
                file.fieldname + "." + file.originalname.split(".").pop()
            }`
        );
    },
});
export const upload = multer({ storage }).single("file");
