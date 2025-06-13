<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { Flight } from '$lib/types';
	import ArrowRight from "phosphor-svelte/lib/ArrowRight";
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';

  interface Props {
		flights: Flight[];
	}

  let { flights }: Props = $props();

	let search = $state('');
	let selectedId: string | undefined = $state(undefined);

	let selectedFlight = $derived.by(() => {
		const f = flights.find((f) => f.id === Number(selectedId));
		return `${f?.carrier}${f?.flight} | ${f?.origin} → ${f?.dest}`;
	})
	// $inspect(search)

	const dispatch = createEventDispatcher();

	let filtered: Flight[] = $derived.by(() => {
		console.log(search)
		return flights.filter(
			(f) =>
				`${f.carrier}${f.flight}`.includes(search.toUpperCase()) ||
				f.origin.includes(search.toUpperCase()) ||
				f.dest.includes(search.toUpperCase())
		);
	});

	$effect(() => {
		if (selectedId) {
			const id = Number(selectedId);
			const sel = flights.find((f) => f.id === id);
			if (sel) dispatch('select', sel);
		}
	});

	function selectFlight(value: string) {
		selectedId = value;
		const id = Number(value);
		const sel = flights.find((f) => f.id === id);
		if (sel) dispatch('select', sel);
	}

</script>

<div class="space-y-2">
	<Input type="text" bind:value={search} placeholder="Search Flights…" />

	<Select.Root type="single" bind:value={selectedId}>
		<Select.Trigger class="w-full">
			{selectedId ? selectedFlight : "select"}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each filtered as f}
					<Select.Item value={String(f.id)}>
						{f.carrier}{f.flight} | {f.origin}<ArrowRight color="#000" />{f.dest}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>
