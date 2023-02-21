import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        file: {
            type: String,
        },
    },
    {
        collection: "products",
        timestamps: true,
    }
);

const Product = model("Product", productSchema);
export default Product;
