import mongoose from "mongoose";
const { Schema, model } = mongoose;

const categorySchema = new Schema(
    {
        name: {
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
        collection: "categories",
        timestamps: true,
    }
);

const Category = model("Category", categorySchema);
export default Category;
