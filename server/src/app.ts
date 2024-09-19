import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { filterTransfersByDate, findTopOrganization } from './services/filterService';
import { calculateTotalWeightByOrganization } from './services/calculationService';
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
      const filePath = path.join(__dirname, filepath);
      const data = await readCSV(filePath);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error reading CSV file', error });
    }
  });

  app.get('/api/top-organization', async (req: Request, res: Response) => {
    try {
      const filePath = path.join(__dirname, filepath);
      const data = await readCSV(filePath);

        //TODO: Change this to param
      const filteredData = filterTransfersByDate(data, '2024-08-07');

      const totals = calculateTotalWeightByOrganization(filteredData);
 
      const topOrganization = findTopOrganization(totals);
      
      res.json(topOrganization);
    } catch (error) {
      res.status(500).json({ message: 'Error processing CSV data', error });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});