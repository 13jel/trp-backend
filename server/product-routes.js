import {Router} from "express";

let productsRouter = new Router();

productsRouter.get("/", (req, res) => {
    res.json([
        { id: 1, name: "Product 1", price: 10 },
        { id: 2, name: "Product 2", price: 20 },
        { id: 3, name: "Product 3", price: 30 } 
    ]);
});

productsRouter.post("/", (req, res) => {
    let name = req.body["name"];
    
    req.body = { name: "New Product", price: 40 };
    res.json({ id: 4, ...req.body });
});

export default productsRouter;