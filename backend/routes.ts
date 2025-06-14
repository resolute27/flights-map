import express from 'express';
import { db } from './db';
import { Flight, Airport } from './models';

const router = express.Router();

// GET /api/flights
router.get('/flights', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
  const offset = (page - 1) * limit;

  try {
    const flights: Flight[] = await db<Flight>('flights')
      .offset(offset)
      .limit(limit);
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: '資料庫錯誤' });
  }
});

// GET /api/airports/:iata
router.get('/airports/:iata', async (req, res) => {
  const iata = req.params.iata.toUpperCase();

  try {
    const airport = await db<Airport>('airports')
      .where({ iata })
      .first();

    if (!airport) {
      res.status(404).json({ detail: 'Airport not found' });
      return;
    }

    if (airport) {
      res.json({
        iata: airport.iata,
        lat: airport.latitude,
        lng: airport.longitude,
        name: airport.name,
      });
    } else {
      res.status(404).json({ detail: 'Airport not found' });
    }
  } catch (err) {
    res.status(500).json({ error: '資料庫錯誤' });
  }
});

export default router;
