import { response } from "express";
import fs from "fs";
import Product from "../models/productsModel.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT;

// get all products
export function getAll(req, res, next) {
    Product.find({}, (err, response) => {
        if (err) return next(err);
        res.status(200).send({ success: true, response });
    });
}

//get product by id
export function getById(req, res, next) {
    let { id } = req.params;
    Product.findOne({ _id: id }, (err, response) => {
        if (err) return next(err);
        res.status(200).send({
            success: true,
            response,
            imagePath: `http://localhost:${PORT}/${response.file}`,
        });
    });
}

// add a product
export function addProduct(req, res) {
    console.log(req.file.path);
    let { path } = req.file || "";
    let { name, description } = req.body;
    let body = { name: name, description: description, file: path };
    let doc = new Product(body);
    console.log(doc);
    doc.save((err, response) => {
        if (err)
            return res.status(500).json({
                message: `ERROR ${err}`,
                success: false,
            });
        res.status(200).send({ success: true, response });
    });
}

//delete a product by id
export function deleteProductById(req, res, next) {
    let { id } = req.params;
    Product.findByIdAndDelete(id, (err, response) => {
        if (err) return next(err);
        fs.unlinkSync(response.file);
        res.status(200).send({ success: true, response });
    });
}

//update product by id
export function updateProductById(req, res, next) {
    let { path } = req.file || "";
    let { name, description } = req.body;
    let body = { name: name, description: description, file: path };
    let { id } = req.params;
    Product.findOneAndUpdate(
        { _id: id },
        {
            $set: body,
        },
        (err, response) => {
            if (err)
                return res.status(500).json({
                    message: `ERROR ${err}`,
                    success: false,
                });
            if (req.file) fs.unlinkSync(response.file);
            res.status(200).send({ success: true, response });
        }
    );
}

const controller = {
    getAll,
    deleteProductById,
    addProduct,
    getById,
    updateProductById,
};
export default controller;
