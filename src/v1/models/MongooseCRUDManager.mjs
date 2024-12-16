class MongooseCRUDManager {
  constructor(model) {
    this.model = model;
  }

  // Вибірка всього списку з бази з фільтрами, projection і populateFields
  async getList(filters = {}, projection = null, populateFields = []) {
    try {
      let query = this.model.find(filters, projection);
      populateFields.forEach((field) => {
        // query = query.populate(field)
        if (typeof field === "string") {
          // Якщо поле передано як рядок
          query = query.populate(field);
        } else if (
          typeof field === "object" &&
          field.fieldForPopulation &&
          field.requiredFieldsFromTargetObject
        ) {
          // Якщо передано об'єкт з полем для заповнення та запитуваними полями
          query = query.populate(
            field.fieldForPopulation,
            field.requiredFieldsFromTargetObject
          );
        }
      });
      const results = await query.exec();
      return results.map((doc) => doc.toObject());
    } catch (error) {
      throw new Error("Error retrieving data: " + error.message);
    }
  }

  // Створення об'єкта і збереження у базі
  async create(data) {
    try {
      const newItem = new this.model(data);
      await newItem.save();
    } catch (error) {
      throw new Error("Error creating data: " + error.message);
    }
  }

  // Пошук за id з використанням populateFields
  async getById(id, populateFields = []) {
    try {
      let query = this.model.findById(id);
      populateFields.forEach((field) => {
        query = query.populate(field);
      });
      return await query.exec();
    } catch (error) {
      throw new Error("Error finding data by id: " + error.message);
    }
  }

  // Пошук одного за фільтром
  async findOne(filters = {}, projection = null, populateFields = []) {
    try {
      let query = this.model.findOne(filters, projection);
      populateFields.forEach((field) => {
        if (typeof field === "string") {
          // Якщо поле передано як рядок
          query = query.populate(field);
        } else if (
          typeof field === "object" &&
          field.fieldForPopulation &&
          field.requiredFieldsFromTargetObject
        ) {
          // Якщо передано об'єкт з полем для заповнення та запитуваними полями
          query = query.populate(
            field.fieldForPopulation,
            field.requiredFieldsFromTargetObject
          );
        }
      });
      return await query.exec();
    } catch (error) {
      throw new Error("Error finding data by id: " + error.message);
    }
  }
  // Оновлення за id
  async update(id, data) {
    try {
      return await this.model
        .findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .exec();
    } catch (error) {
      throw new Error("Error updating data: " + error.message);
    }
  }

  // Видалення за id
  async deleteById(id) {
    try {
      return await this.model.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error("Error deleting data: " + error.message);
    }
  }
}

export default MongooseCRUDManager;
