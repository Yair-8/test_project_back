import mongoose from "mongoose";
const { Schema } = mongoose;

// Створення схеми товару
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3, // мінімальна довжина 3 символи
    maxlength: 100, // максимальна довжина 100 символів
  },
  price: {
    type: Number,
    required: true,
    min: 0, // ціна не може бути меншою за 0
  },
  description: {
    type: String,
    maxlength: 500, // максимальна довжина опису 500 символів
  },
  image: {
    type: String,
    validate: {
      validator: function (v) {
        return /^data:image\/(jpeg|png|gif|bmp);base64,/.test(v);
      },
      message:
        "Image must be a valid base64 string in JPEG, PNG, GIF, or BMP format",
    },
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
