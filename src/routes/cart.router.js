import { Router } from "express"
import CartManager from "../dao/dbManagers/cartsManager.js"

//router y manager
const router = Router()
const manager = new CartManager("./data/carts.json")

//api/carts

//getAll, funciona perfecto
router.get("/", async (req, res) => {
    const carts = await manager.getAll()
    if (carts.length <= 0) {
        res.send({ status: 'Error', message: 'Carts collection is empty.' })
    } else {
        res.send(carts)
    }
})

//createCart, si no existe lo crea, si existe suma uno nuevo
router.post("/", async (req, res) => {
    try {
        const carts = await manager.getAll()
        if (carts.length <= 0) {
            await manager.createCart()
            console.log("cartRouter post didnt find any carts in db, but one was created. ")
            res.send({ status: "Ok", message: "New cart added." })
        } else {
            await manager.createCart()
            res.send({ status: "Ok", message: "New cart added." })
        }
    } catch (error) { return { status: "error", message: error.message } }
})

//getCartById, 
router.get("/:cid", async (req, res) => {
    const cid = req.params.cid
    const foundCart = await manager.getCartById(cid)
    if (foundCart) {
        res.send(foundCart)
    } else {
        res.send({ error: `GET cart/:pid failed, id not found.` })
    }
})

//add product to cart
router.post("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const result = await manager.addProductToCart(cid, pid)
    res.send(result)
})

//delete cart
router.delete("/:cid", async (req, res) => {
    const cid = req.params.cid
    const result = await manager.deleteCart(cid)
    res.send(result)
})

router.put('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const result = await manager.deleteProductFromCart(cid, pid)
    res.send(result)
})

export default router
