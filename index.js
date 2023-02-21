import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connect from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import categoryRouter from "./routes/categoriesRoute.js";
import productRouter from "./routes/productsRoute.js";
import cors from "cors";

dotenv.config();

connect();

const PORT = process.env.PORT;
const app = new express();
app.use(cors());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running...");
});
app.use(cookieParser());
app.use(function (err, req, res, next) {
    next(catchError(404));
});
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use(express.urlencoded({ extended: false }));
app.use("/upload", express.static("upload"));
app.use(function (err, req, res, next) {
    res.status(err.status || 500).send({ sucess: false, message: err.message });
});

app.listen(
    PORT,
    console.log(
        `Server is running in ${process.env.NODE_ENV} on port ${PORT}!!!`
    )
);
