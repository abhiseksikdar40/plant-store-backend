const { initializePlantStoreData } = require('./db/db.connect')

// const fs = require('fs')
const PlantStore = require('./models/plantStore.model')
const Cart = require('./models/cart.model')
initializePlantStoreData()

const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
    origin: "*"
}

app.use(cors(corsOptions));
app.use(express.json());

// const jsonData = fs.readFileSync('plant.json', 'utf-8')

// const plantsData = JSON.parse(jsonData)

// function seedData () {
//     try {
//         for(const plantData of plantsData){
//             const newPlantData = new PlantStore({
//                 productImg: plantData.productImg,
//                 productName: plantData.productName,
//                 productDescription: plantData.productDescription,
//                 productCategory: plantData.productCategory,
//                 productRating: plantData.productRating,
//                 productPrice: plantData.productPrice,
//                 productDiscount: plantData.productDiscount
//             })

//             newPlantData.save()
//         }
//     } catch (error) {
//         console.log("Error seeding plant data.", error)
//     }
// }

// // seedData()


const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})


// get all Products

async function getAllProducts() {
    try {
        const allProducts = await PlantStore.find()
        return allProducts
    } catch (error) {
        console.log("Error occured while getting all products.");  
    }
}

app.get("/products", async (req, res) => {
    try {
        const getProducts = await getAllProducts()
        if(getProducts.length != 0) {
            res.json(getProducts)
        } else {
            res.status(404).json({error: "Product Not Found!"})
        }
    } catch (error) {
        res.status(500).json({error: "Failed To Get All Products!"})
    }
})


// get product by id

async function getProductById(productId) {
    try {
        const findProductById = await PlantStore.findById(productId)
        return findProductById
    } catch (error) {
        console.log("Error occured while getting product by id.");  
    }
}

app.get("/products/:productId", async (req, res) => {
    try {
        const productById = await getProductById(req.params.productId)
        if(productById) {
            res.json(productById)
        } else {
            res.status(404).json({error: "Product Not Found!"})
        }
    } catch (error) {
        res.status(500).json({error: "Failed To Get Products By Id!"})
    }
})


// get product by category

async function getProductByCategory(productByCategory) {
    try {
        const findProductByCategory = await PlantStore.find({productCategory: productByCategory})
        return findProductByCategory
    } catch (error) {
        console.log("Error occured while getting products by category.");  
    }
}

app.get("/products/category/:productCategory", async (req, res) => {
    try {
        const productByCategory = await getProductByCategory(req.params.productCategory)
        if(productByCategory.length != 0) {
            res.json(productByCategory)
        } else {
            res.status(404).json({error: "Product Not Found!"})
        }
    } catch (error) {
        res.status(500).json({error: "Failed To Get Products By Category!"})
    }
})

// Add to cart

async function addToCart(newProduct) {
    try {
        const addProductToCart = new Cart(newProduct);
     const savedCart = await addProductToCart.save()
     return savedCart
    } catch (error) {
     console.log("Error Adding New Product To Cart", error);
    }
 }


 app.post("/cart", async (req, res) => {
    try {
        const savedProduct = await addToCart(req.body)
        res.status(201).json({message: "Product Send To Cart Successfully.", recipe: savedProduct})
    } catch (error) {
        res.status(500).json({error: "Failed To Send Product Data To Cart."})
    }
})


async function getCartList() {
    try {
        const findAllCartItems = await Cart.find().populate('product'); 
        return findAllCartItems;
    } catch (error) {
        console.log("Error occurred while getting Cart Items:", error);  
    }
}


app.get('/cart', async (req, res) => {
    try {
        const cartItems = await getCartList();
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cart items." });
    }
});




async function deleteCart(recipeId) {
    try {
        const findCartItemAndDelete = await Cart.findByIdAndDelete(recipeId);
        return findCartItemAndDelete
    } catch (error) {
        console.log("Error occured while deleting Cart Details.");  
    }
}

app.delete('/cart/:id', async (req, res) => {
    try {
        const deletedItem = await deleteCart(req.params.id);
        if (deletedItem) {
            res.json({ message: "Item removed from cart." });
        } else {
            res.status(404).json({ error: "Cart item not found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to remove item from cart." });
    }
});