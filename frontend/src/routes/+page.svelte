<script lang="ts">
	import { onMount } from 'svelte';
	import FlightSelector from '$lib/ui/FlightSelector.svelte';
	import { initMap, updateMap } from '$lib/map';
	import { tick } from 'svelte';
	import type { Flight } from '$lib/types';
	import { fetchFlights } from '$lib/api';
	import { circInOut } from 'svelte/easing';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import X from 'phosphor-svelte/lib/X';
	import AirplaneInFlight from 'phosphor-svelte/lib/AirplaneInFlight';
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';

	let flights: Flight[] = $state([]);
	let selected: Flight | null = $state(null);
	let isSidebarOpen = $state(true);

	// $inspect(selected);
	// $inspect(flights);

	onMount(async () => {
		flights = await fetchFlights();
		await initMap();
	});

	function handleSelect(e: CustomEvent<Flight>) {
		selected = e.detail;
		// console.log(e.detail);
		updateMap(selected);
	}
</script>

<!-- 地圖容器 -->
<div class="relative h-screen w-screen">
	<div id="map" class="absolute inset-0 z-0 h-full w-full"></div>

	<!-- 浮動 UI：搜尋＋選單＋航班資訊 -->
	{#if isSidebarOpen}
		<div class="bg-gray absolute top-4 left-4 z-10 w-[320px] space-y-4 rounded-lg shadow-md">
			<header class="mb-0 p-2">
				<div class="flex items-start justify-between">
					<div class="flex gap-2">
						<p class="text-yellow text-xl font-medium">{selected ? selected.tailnum : 'Flights Data'}</p>
						<!-- <Badge class="bg-[#325f79] px-1 py-1 text-white">E3TF</Badge> -->
					</div>
					<button
						onclick={() => {
							isSidebarOpen = !isSidebarOpen;
						}}
					>
						<X size={24} color="#fff" class="cursor-pointer" />
					</button>
				</div>
				<!-- <div class="text-sm font-medium text-white">NATO</div> -->
			</header>
			<main class="relative bg-white">
				<FlightSelector {flights} on:select={handleSelect} />
				{#if selected}
					<!-- <div class="space-y-2 rounded-2xl border border-white/40 bg-white/30 p-4 shadow-xl">
						<p class="text-lg font-bold">{selected.carrier}{selected.flight}</p>
						<p><strong>From:</strong> {selected.origin}</p>
						<p><strong>To:</strong> {selected.dest}</p>
						<p><strong>Departure:</strong> {selected.dep_time}</p>
						<p><strong>Arrival:</strong> {selected.arr_time}</p>
					</div> -->

					<!-- main information -->
					<div class="relative grid grid-cols-2 gap-4 rounded-lg bg-gray-100 p-4 shadow-lg">
						<div
							class="absolute top-0 left-1/2 mt-5 flex -translate-x-1/2 rounded-full bg-white p-2 shadow-md"
						>
							<AirplaneInFlight size={30} color="#f8c023" weight="fill" />
						</div>

						<div class="col-span-1 text-center">
							<p class="text-xs text-gray-500">Origin</p>
							<p class="text-3xl font-bold text-gray-800">{selected.origin}</p>
						</div>
						<div class="col-span-1 text-center">
							<p class="text-xs text-gray-500">Destination</p>
							<p class="text-3xl font-bold text-gray-800">{selected.dest}</p>
						</div>

						<div class="col-span-2 text-center text-sm text-gray-600">
							<p class="font-medium">
								{selected.name} (Carrier: {selected.carrier}) - Flight: {selected.flight}
							</p>
						</div>

						<div class="col-span-2 grid grid-cols-2 gap-4 text-center">
							<div>
								<p class="text-xs text-gray-500">Scheduled Departure</p>
								<p class="text-lg font-medium text-gray-700">
									{Math.floor(selected.sched_dep_time / 100)
										.toString()
										.padStart(2, '0')}:{(selected.sched_dep_time % 100).toString().padStart(2, '0')}
								</p>
								{#if selected.dep_delay > 0}
									<p class="text-sm font-semibold text-red-500">
										Delayed: {selected.dep_delay} min
									</p>
								{:else if selected.dep_delay < 0}
									<p class="text-sm font-semibold text-green-600">
										Early: {-selected.dep_delay} min
									</p>
								{:else}
									<p class="text-sm text-gray-500">On Time</p>
								{/if}
							</div>

							<div>
								<p class="text-xs text-gray-500">Scheduled Arrival</p>
								<p class="text-lg font-medium text-gray-700">
									{Math.floor(selected.sched_arr_time / 100)
										.toString()
										.padStart(2, '0')}:{(selected.sched_arr_time % 100).toString().padStart(2, '0')}
								</p>
								{#if selected.arr_delay > 0}
									<p class="text-sm font-semibold text-red-500">
										Delayed: {selected.arr_delay} min
									</p>
								{:else if selected.arr_delay < 0}
									<p class="text-sm font-semibold text-green-600">
										Early: {-selected.arr_delay} min
									</p>
								{:else}
									<p class="text-sm text-gray-500">On Time</p>
								{/if}
							</div>
						</div>

						<div class="col-span-2 text-center">
							<p class="text-xs text-gray-500">Air Time / Distance</p>
							<p class="text-base font-medium text-gray-700">
								{selected.air_time} mins / {selected.distance} miles
							</p>
						</div>

						<div class="col-span-2 text-center text-xs text-gray-400">
							<p>
								Date: {selected.year}-{selected.month.toString().padStart(2, '0')}-
								{selected.day.toString().padStart(2, '0')}
							</p>
							<p>Tail Number: {selected.tailnum}</p>
						</div>
					</div>
				{/if}
			</main>
		</div>
	{:else}
		<div
			class="bg-gray absolute top-4 left-4 z-10 flex h-13 w-13 items-center justify-center rounded-full p-1"
		>
			<button
				class="cursor-pointer"
				onclick={() => {
					isSidebarOpen = !isSidebarOpen;
				}}
			>
				<MagnifyingGlass size={32} color="#fff" />
			</button>
		</div>
	{/if}
</div>
