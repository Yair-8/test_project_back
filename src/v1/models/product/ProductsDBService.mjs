import Product from './Product.mjs'
import MongooseCRUDManager from '../MongooseCRUDManager.mjs'

class ProductsDBService extends MongooseCRUDManager {
  async getList(filters) {
    try {
      const res = await super.getList(filters)
      return res
    } catch (error) {
      return []
    }
  }
}

export default new ProductsDBService(Product)
