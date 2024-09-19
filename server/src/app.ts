import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { filterTransfersByDate, findTopOrganization, findMostCommonTransfer} from './services/filterService';
import { calculateTotalWeightByOrganization, calculateMaterialAToB } from './services/calculationService';
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

  const readCSVWithoutLibrary = (filePath: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }
        
        const lines = data.trim().split('\n');
        const headers = lines[0].split(',');
  
        const results = lines.slice(1).map((line) => {
          const values = line.split(',');
          const row: { [key: string]: any } = {};
  
          headers.forEach((header, index) => {
            row[header] = values[index];
          });
  
          return row;
        });
  
        resolve(results);
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
  app.get('/api/material-transfer', async (req: Request, res: Response) => {
    try {
      const filePath = path.join(__dirname, filepath);
      const data = await readCSV(filePath);

      const materialA =  req.query.materialA ||'4d876d21-f841-4461-9122-799331c39527'; // A
      const materialB = req.query.materialA  || 'd2523f75-6e98-4654-a261-61e3f09e1eb8'; // B
  
      const totalTransfer = calculateMaterialAToB(data, materialA as string, materialB as string);
  
      res.json({ materialA, materialB, totalTransfer });
    } catch (error) {
      res.status(500).json({ message: 'Error processing CSV data', error });
    }
  });
  
  app.get('/api/top-organization', async (req: Request, res: Response) => {
    try {
      const filePath = path.join(__dirname, filepath);
      const data = await readCSV(filePath);
      const date = req.query.date || '2024-08-07';

      const filteredData = filterTransfersByDate(data, date as string);

      const totals = calculateTotalWeightByOrganization(filteredData);
 
      const topOrganization = findTopOrganization(totals);
      
      res.json(topOrganization);
    } catch (error) {
      res.status(500).json({ message: 'Error processing CSV data', error });
    }
  });

  app.get('/api/most-common-transfer', async (req: Request, res: Response) => {
    try {
      const filePath = path.join(__dirname, filepath);
      const data = await readCSV(filePath);
  
      const mostCommonTransfer = findMostCommonTransfer(data);
  
      res.json(mostCommonTransfer);
    } catch (error) {
      res.status(500).json({ message: 'Error processing CSV data', error });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});