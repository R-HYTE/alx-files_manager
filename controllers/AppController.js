import { redisClient } from '../utils/redis';
import { dbClient } from '../utils/db';

const AppController = {
  getStatus: async (req, res) => {
    try {
      const redisAlive = await redisClient.isAlive();
      const dbAlive = await dbClient.isAlive();

      res.status(200).json({ redis: redisAlive, db: dbAlive });
    } catch (error) {
      console.error('Error checking status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getStats: async (req, res) => {
    try {
      const numUsers = await dbClient.collection('users').countDocuments();
      const numFiles = await dbClient.collection('files').countDocuments();

      res.status(200).json({ users: numUsers, files: numFiles });
    } catch (error) {
      console.error('Error retrieving stats:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

export default AppController;
