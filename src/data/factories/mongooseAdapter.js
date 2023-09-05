
import mongoose from "mongoose";

class MongooseAdapter {
  async init(uri) {
    this.connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  async close() {
    await this.connection.disconnect();
  }

  async clear() {
    const collections = await mongoose.connection.db.collections();

    for (const collectionName in collections) {
      const collection = collections[collectionName];
      await collection.deleteMany({});
      console.log(`Collection deleted.`);
    }
  }
}

export default MongooseAdapter;
