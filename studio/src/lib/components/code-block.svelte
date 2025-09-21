<script lang="ts">
	import { CopyIcon } from '@lucide/svelte';
	import Button from './ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import ScrollArea from './ui/scroll-area/scroll-area.svelte';

	const {
		text = '',
		class: className,
		language
	}: { text?: string; class?: string; language?: 'json' } = $props();
	let copied = $state(false);

	const colorize: { [L in NonNullable<typeof language>]: (text: string) => string } = {
		json: (text: string) =>
			text
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(
					/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
					(match) => {
						let cls = 'number';
						if (/^"/.test(match)) {
							cls = /:$/.test(match) ? 'key' : 'string';
						} else if (/true|false/.test(match)) {
							cls = 'boolean';
						} else if (/null/.test(match)) {
							cls = 'null';
						}
						return `<span class="${cls}">${match}</span>`;
					}
				)
	};
</script>

<section class="group bg-secondary relative overflow-clip rounded-md p-1 pt-0 dark:bg-black/30">
	<ScrollArea orientation="horizontal" class="group relative size-full ">
		<code class={cn('relative inline-block w-full px-2 py-3 whitespace-pre', language, className)}>
			{#if language}
				{@html colorize[language](text)}
			{:else}
				{text}
			{/if}
		</code>
	</ScrollArea>
	<Button
		size="icon"
		variant="outline"
		disabled={copied}
		class={cn(
			'absolute top-1 right-1 size-7 p-1 opacity-0 transition-opacity group-hover:opacity-100'
		)}
		onclick={async () => {
			copied = true;
			await navigator.clipboard.writeText(text);
			setTimeout(() => {
				copied = false;
			}, 500);
		}}><CopyIcon class="size-3" /></Button
	>
</section>

<style lang="postcss">
	code.json :global {
		.string {
			color: oklch(0.577 0.1853 144.1);
		}
		.number {
			color: oklch(0.7394 0.1853 65.14);
		}
		.boolean {
			color: var(--accent);
		}
		.null {
			color: oklch(0.6614 0.1853 341.49);
		}
		.key {
			color: var(--destructive);
		}
	}
</style>
