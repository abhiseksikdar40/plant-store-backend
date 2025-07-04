const { initializePlantStoreData } = require("./db/db.connect");


const PlantStore = require("./models/plantStore.model");
const Cart = require("./models/cart.model");
const Address = require("./models/address.model");
const Wishlist = require("./models/wishlist.model")
const Order = require("./models/order.model");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type"],
  })
);


app.use(express.json());




async function getAllProducts() {
  try {
    const allProducts = await PlantStore.find();
    return allProducts;
  } catch (error) {
    console.log("Error occured while getting all products.");
  }
}

app.get("/products", async (req, res) => {
  try {
    const getProducts = await getAllProducts();
    if (getProducts.length != 0) {
      res.json(getProducts);
    } else {
      res.status(404).json({ error: "Product Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed To Get All Products!" });
  }
});

// get product by id

async function getProductById(productId) {
  try {
    const findProductById = await PlantStore.findById(productId);
    return findProductById;
  } catch (error) {
    console.log("Error occured while getting product by id.");
  }
}

app.get("/products/:productId", async (req, res) => {
  try {
    const productById = await getProductById(req.params.productId);
    if (productById) {
      res.json(productById);
    } else {
      res.status(404).json({ error: "Product Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed To Get Products By Id!" });
  }
});

// get product by category

async function getProductByCategory(productByCategory) {
  try {
    const findProductByCategory = await PlantStore.find({
      productCategory: productByCategory,
    });
    return findProductByCategory;
  } catch (error) {
    console.log("Error occured while getting products by category.");
  }
}

app.get("/products/category/:productCategory", async (req, res) => {
  try {
    const productByCategory = await getProductByCategory(
      req.params.productCategory
    );
    if (productByCategory.length != 0) {
      res.json(productByCategory);
    } else {
      res.status(404).json({ error: "Product Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed To Get Products By Category!" });
  }
});

// Add to cart

async function addToCart(newProduct) {
  try {
    const addProductToCart = new Cart(newProduct);
    const savedCart = await addProductToCart.save();
    return savedCart;
  } catch (error) {
    console.log("Error Adding New Product To Cart", error);
  }
}

app.post("/cart", async (req, res) => {
  try {
    const savedProduct = await addToCart(req.body);
    res.status(201).json({
      message: "Product Send To Cart Successfully.",
      recipe: savedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed To Send Product Data To Cart." });
  }
});

async function getCartList() {
  try {
    const findAllCartItems = await Cart.find().populate("product");
    return findAllCartItems;
  } catch (error) {
    console.log("Error occurred while getting Cart Items:", error);
  }
}

app.get("/cart", async (req, res) => {
  try {
    const cartItems = await getCartList();
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart items." });
  }
});

async function deleteCart(cartItemId) {
  try {
    const deleted = await Cart.findByIdAndDelete(cartItemId);
    return deleted;
  } catch (error) {
    console.log("Error occurred while deleting Cart Details.", error);
  }
}

app.delete("/cart/:id", async (req, res) => {
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


// ✅ Update Cart Quantity
async function updateCartQuantity(cartItemId, newQuantity) {
  try {
    const updatedCartItem = await Cart.findByIdAndUpdate(
      cartItemId,
      { quantity: newQuantity },
      { new: true }
    );
    return updatedCartItem;
  } catch (error) {
    console.log("Error occurred while updating Cart quantity.", error);
  }
}

app.post("/cart/update/:cartItemId", async (req, res) => {
  try {
    const { quantity } = req.body;
    const updatedItem = await updateCartQuantity(req.params.cartItemId, quantity);
    if (updatedItem) {
      res.json(updatedItem);
    } else {
      res.status(404).json({ error: "Cart item not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart quantity." });
  }
});



async function getAllAddress() {
  try {
    const allAddress = await Address.find();
    return allAddress;
  } catch (error) {
    console.log("Error occured while getting all address.");
  }
}

app.get("/address", async (req, res) => {
  try {
    const getAddress = await getAllAddress();
    if (getAddress.length != 0) {
      res.json(getAddress);
    } else {
      res.status(404).json({ error: "Address Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed To Get All Address!" });
  }
});

// 🔹 Add Address
async function addAddress(addressData) {
  try {
    const address = new Address(addressData);
    const savedAddress = await address.save();
    return savedAddress;
  } catch (error) {
    console.log("Error occurred while adding Address.", error);
  }
}

app.post("/address", async (req, res) => {
  try {
    const newAddress = await addAddress(req.body);
    res.status(201).json({ address: newAddress });
  } catch (error) {
    res.status(500).json({ error: "Failed to add address." });
  }
});

async function updateAddress(addressId, updatedData) {
  try {
    const updated = await Address.findByIdAndUpdate(addressId, updatedData, {
      new: true,
    });
    return updated;
  } catch (error) {
    console.log("Error occurred while updating Address.", error);
  }
}

app.post("/address/update/:addressid", async (req, res) => {
  try {
    const updatedAddress = await updateAddress(req.params.addressid, req.body);
    if (updatedAddress) {
      res.json({ message: "Address updated successfully.", updatedAddress });
    } else {
      res.status(404).json({ error: "Address not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update address." });
  }
});

async function deleteAddress(addressId) {
  try {
    const deleteAddress = await Address.findByIdAndDelete(addressId);
    return deleteAddress;
  } catch (error) {
    console.log("Error occurred while deleting Address.", error);
  }
}

app.delete("/address/delete/:id", async (req, res) => {
  try {
    const deletedAddress = await deleteAddress(req.params.id);
    if (deletedAddress) {
      res.json({ message: "Address removed successfully." });
    } else {
      res.status(404).json({ error: "Address not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to remove address." });
  }
});

app.get("/test", (req, res) => res.send("OK"));

const PORT = 3000;

// Initialize database and start server
const startServer = async () => {
  try {
    await initializePlantStoreData();
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();


async function addToWishlist(newWishlistItem) {
  try {
    const addedItem = new Wishlist(newWishlistItem);
    const savedItem = await addedItem.save();
    return savedItem;
  } catch (error) {
    console.log("Error adding product to wishlist:", error);
  }
}

app.post("/wishlist", async (req, res) => {
  try {
    const savedWishlistItem = await addToWishlist(req.body);
    res.status(201).json({
      message: "Product added to wishlist successfully.",
      item: savedWishlistItem,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add product to wishlist." });
  }
});


async function getWishlistItems() {
  try {
    const allItems = await Wishlist.find().populate("product");
    return allItems;
  } catch (error) {
    console.log("Error fetching wishlist items:", error);
  }
}

app.get("/wishlist", async (req, res) => {
  try {
    const items = await getWishlistItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wishlist items." });
  }
});


async function removeWishlistItem(itemId) {
  try {
    const removedItem = await Wishlist.findByIdAndDelete(itemId);
    return removedItem;
  } catch (error) {
    console.log("Error removing item from wishlist:", error);
  }
}

app.delete("/wishlist/:id", async (req, res) => {
  try {
    const deleted = await removeWishlistItem(req.params.id);
    if (deleted) {
      res.json({ message: "Item removed from wishlist." });
    } else {
      res.status(404).json({ error: "Wishlist item not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to remove wishlist item." });
  }
});


app.post("/orders", async (req, res) => {
  try {
    const { cartItems, addressId, totalAmount, orderDate } = req.body;

    // validate fields
    if (!cartItems || !addressId || !totalAmount || !orderDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Save order logic (example)
    const order = new Order({
      cartItems,
      address: addressId,
      totalAmount,
      orderDate,
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/orders/buynow", async (req, res) => {
  try {
    const { productId, quantity, addressId, totalAmount, orderDate } = req.body;

    // Validate required fields
    if (!productId || !quantity || !addressId || !totalAmount || !orderDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create order with single product and quantity
    const order = new Order({
      product: productId,
      quantity,
      address: addressId,
      totalAmount,
      orderDate,
    });

    await order.save();

    res.status(201).json({ message: "Buy Now order placed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
