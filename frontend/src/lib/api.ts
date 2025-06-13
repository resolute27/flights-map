import type { Flight } from './types';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
	baseURL: API_BASE_URL
});

export default api;

export async function fetchFlights(): Promise<Flight[]> {
	const res = await api.get('/api/flights', {
		params: {
			page: 1,
			limit: 50
		}
	});
	if (!res) throw new Error('Failed to load flights');
	return res.data;
}

export async function fetchAirportCoords(iata: string): Promise<[number, number]> {
	const res = await api.get(`/api/airports/${iata}`);
	if (!res) throw new Error('No airport found: ' + iata);
	const data = await res.data;
	return [data.lat, data.lng];
}
