<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { ChevronRightIcon } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { buttonVariants } from './ui/button';
	import { cn } from '$lib/utils';

	const { title, children }: { title: string; children?: Snippet } = $props();
</script>

<Collapsible.Root class="group" open={false}>
	<Collapsible.Trigger
		class={cn(
			buttonVariants({ size: 'icon', variant: 'ghost' }),
			'flex h-6 w-max flex-row items-center gap-1 px-2 pl-1'
		)}
	>
		<ChevronRightIcon class="transition-transform group-data-[state=open]:rotate-90" />
		<h3 class="text-sm font-bold">{title}</h3>
	</Collapsible.Trigger>
	<Collapsible.Content class="max-w-full pr-2 pl-4">
		{@render children?.()}
	</Collapsible.Content>
</Collapsible.Root>
