import Category from "../models/categoriesModel.js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT;

class Controller {
    getAll(req, res, next) {
        Category.find({}, (err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        });
    }
    get(req, res, next) {
        let { id } = req.params;
        Category.findOne({ _id: id }, (err, response) => {
            if (err) return next(err);
            res.status(200).send({
                success: true,
                response,
                imagePath: `http://localhost:${PORT}/${response.file}`,
            });
        });
    }
    create(req, res, next) {
        let { path } = req.file || "";
        let { name, price } = req.body;
        let body = { name: name, price: price, file: path };
        let doc = new Category(body);
        doc.save((err, response) => {
            if (err) return next(err);
            res.status(200).send({ success: true, response });
        });
    }
    update(req, res, next) {
        let { path } = req.file || "";
        let { name, price } = req.body;
        let body = { name: name, price: price, file: path };
        let { id } = req.params;
        Category.findOneAndUpdate(
            { _id: id },
            {
                $set: body,
            },
            (err, response) => {
                if (err) return next(err);
                if (req.file) fs.unlinkSync(response.file);
                res.status(200).send({ success: true, response });
            }
        );
    }
    delete(req, res, next) {
        let { id } = req.params;
        Category.findByIdAndDelete({ _id: id }, (err, response) => {
            if (err) return next(err);
            fs.unlinkSync(response.file);
            res.status(200).send({ success: true, response });
        });
    }
}

const controller = new Controller();

export default controller;
