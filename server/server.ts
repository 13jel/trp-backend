import express from "express";
import "dotenv/config";
import cors from "cors";
import productsRouter from "./product-routes.js";
import cartRouter from "./cart-routes.js";
import orderRouter from "./order-routes.js";
//import messagesRouter from "./routes/messages.js";


const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
//app.use("/api/messages", messagesRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));