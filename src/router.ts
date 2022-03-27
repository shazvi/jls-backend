import express from "express";
import {getProducts, getProductById, updateProductById, createTransaction} from './service';
import {FullProduct} from "./interface";

export const router = express.Router();

// Get all core products
router.get("/", async (req, res) => {
    try {
        const products = await getProducts();

        return res.json({
            success: true,
            data: products
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
    
});

// Get core product by core_id
router.get("/:id", async (req, res) => {
    try {
        const coreProduct: FullProduct | null = await getProductById(req.params.id);

        if (!coreProduct) {
            return res.status(404).json({
                success: false,
                message: "Not found"
            });
        }
        return res.json({
            success: true,
            data: coreProduct
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
    
});

// update location quantity, create stock movement transaction
router.put("/:id", async (req, res) => {
    try {
        // update location quantity
        const isSuccess1 = await updateProductById(req.params.id, req.body.location, req.body.quantityChange);
        let isSuccess2 = false;
        
        if(isSuccess1) {
            // create stock movement transaction
            isSuccess2 = await createTransaction(req.params.id, req.body.location, req.body.quantityChange);
        }
        
        return res.json({success: isSuccess1 && isSuccess2});
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});
