import type { Flight } from './types';
import api from './api'

let map: L.Map | null = null;
let currentLayers: L.Layer[] = [];

export async function initMap() {
	const L = await import('leaflet');
	// if (map) return;

	L.Icon.Default.prototype.options.iconRetinaUrl = '/marker-icon-2x.png';
  L.Icon.Default.prototype.options.iconUrl = '/marker-icon.png';
  L.Icon.Default.prototype.options.shadowUrl = '/marker-shadow.png';

	map = L.map('map', {
		zoomControl: false,
		minZoom: 3,
  	maxZoom: 10
	}).setView([39.8, -98.5], 4);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '© OpenStreetMap contributors'
	}).addTo(map);

	setTimeout(() => map?.invalidateSize(), 100);
}

export async function updateMap(flight: Flight) {
	if (!map) return;

	clearPrevious();

	const [origin, dest] = await Promise.all([getCoords(flight.origin), getCoords(flight.dest)]);

	if (!origin || !dest) {
		console.warn('Missing coordinates for:', flight.origin, flight.dest);
		return;
	}

	const L = await import('leaflet');

	const polyline = L.polyline([origin, dest], { color: 'red' }).addTo(map);
	const markerA = L.marker(origin).addTo(map).bindPopup(`From: ${flight.origin}`);
	const markerB = L.marker(dest).addTo(map).bindPopup(`To: ${flight.dest}`);

	map.fitBounds([origin, dest], { padding: [50, 50] });

	currentLayers.push(polyline, markerA, markerB);
}

function clearPrevious() {
	if (!map) return;
	currentLayers.forEach((layer) => map?.removeLayer(layer));
	currentLayers = [];
}

async function getCoords(iata: string): Promise<[number, number] | null> {
	try {
		const res = await api.get(`/api/airports/${iata}`);
		if (!res) return null;
		const data: { lat: number; lng: number } = await res.data;
		return [data.lat, data.lng];
	} catch {
		return null;
	}
}
