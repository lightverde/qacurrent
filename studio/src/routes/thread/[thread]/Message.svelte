<script lang="ts">
	import { pickTextColor, stringToColor } from '$lib/color';
	import * as Card from '$lib/components/ui/card';
	import type { Message } from '$lib/threads';
	import { cn } from '$lib/utils';
	import { ArrowRight, ArrowRightIcon } from '@lucide/svelte';
	import AgentName from './AgentName.svelte';
	import type { SvelteSet } from 'svelte/reactivity';

	let {
		message,
		agentFilters,
		class: className
	}: {
		message: Message;
		agentFilters?: SvelteSet<string>;
		class?: string;
	} = $props();

	let senderColor = $derived(stringToColor(message.senderId));
	let date = $derived(new Date(message.timestamp));
	let mentions = $derived(message.mentions ?? []);
</script>

<Card.Root class={cn('gap-2 py-4', className)}>
	<Card.Header class="flex flex-row gap-1 px-4 text-sm leading-5">
		<AgentName
			color={senderColor}
			name={message.senderId}
			disabled={agentFilters && !agentFilters.has(message.senderId)}
		/>
		<span class="w-max">-></span>
		{#each mentions as mention}
			{@const mentionColor = stringToColor(mention)}
			<AgentName
				color={mentionColor}
				name={mention}
				disabled={agentFilters && !agentFilters.has(mention)}
			/>
		{/each}
		{#if mentions.length == 0}
			<span class="text-muted-foreground">nobody</span>
		{/if}
		<p class="flex-grow text-right" title={message.timestamp?.toString() ?? 'null'}>
			{`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`}
		</p>
	</Card.Header>
	<Card.Content class="px-4 whitespace-pre-wrap">
		{message.content}
	</Card.Content>
</Card.Root>
