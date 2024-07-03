import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    this.isClientConnected = false;

    this.client.connect((err) => {
      if (err) {
        console.error('MongoDB connection error:', err);
        this.isClientConnected = false;
      } else {
        this.isClientConnected = true;
      }
    });
  }

  isAlive() {
    return this.isClientConnected;
  }

  async nbUsers() {
    if (!this.isAlive()) {
      throw new Error('MongoDB connection error');
    }

    const usersCollection = this.client.db().collection('users');
    const count = await usersCollection.countDocuments();
    return count;
  }

  async nbFiles() {
    if (!this.isAlive()) {
      throw new Error('MongoDB connection error');
    }

    const filesCollection = this.client.db().collection('files');
    const count = await filesCollection.countDocuments();
    return count;
  }

  collection(name) {
    if (!this.isAlive()) {
      throw new Error('MongoDB connection error');
    }

    return this.client.db().collection(name);
  }
}

export const dbClient = new DBClient();
export default dbClient;
