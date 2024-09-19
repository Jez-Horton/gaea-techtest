import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const app = express();
const PORT = process.env.PORT || 5000;
const filepath = '../../transfers.csv';
const readCSV = (filePath: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          resolve(results);
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  };

  app.get('/api/data', async (req: Request, res: Response) => {
    try {
      const filePath = path.join(__dirname, filepath); // Ensure the CSV file is in the correct path
      const data = await readCSV(filePath);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error reading CSV file', error });
    }
  });


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});