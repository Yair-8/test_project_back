import ProductsDBService from "../models/product/ProductsDBService.mjs";

class ProductController {
  // Метод для отримання всіх товарів
  static async getAllProducts(req, res) {
    try {
      const filters = {};
      for (const key in req.query) {
        if (req.query[key]) filters[key] = req.query[key];
      }

      const productsList = await ProductsDBService.getList(filters);
      res.status(200).json({
        products: productsList,
        user: req.user,
      });
    } catch (error) {
      res.status(500).json({ error: "Error fetching products" });
    }
  }

  static async registerForm(req, res) {
    try {
      if (!req.user) {
        return res.status(403).json({ error: "Access denied" });
      }

      const id = req.params.id;
      let product = null;
      if (id) {
        product = await ProductsDBService.getById(id);
      }

      res.status(200).json({
        data: product,
        user: req.user,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async registerProduct(req, res) {
    if (!req.user) {
      return res.status(403).json({ error: "Access denied" });
    }
    try {
      const productData = {
        ...req.body,
      };
      console.log("productData===========>", productData);

      if (req.file?.buffer) {
        productData.image = req.file.buffer.toString("base64");
      }

      if (req.params.id) {
        await ProductsDBService.update(req.params.id, productData);
      } else {
        await ProductsDBService.create(productData);
      }

      res.status(200).json({ message: "Product registered successfully" });
    } catch (err) {
      res.status(500).json({
        errors: [{ msg: err.message }],
        user: req.user,
      });
    }
  }

  // Метод для видалення товару (доступний тільки для адміністратора)
  static async deleteProduct(req, res) {
    if (!req.user) {
      return res.status(403).json({ error: "Access denied" });
    }

    try {
      await ProductsDBService.deleteById(req.body.id);
      res.status(200).json({ message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting product" });
    }
  }
}

export default ProductController;
