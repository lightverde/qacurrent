<script module lang="ts">
	export type Item = {
		target: HTMLElement;
		text: string;
		side?: TooltipPrimitive.ContentProps['side'];
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	import IconX from 'phosphor-icons-svelte/IconXRegular.svelte';

	import * as Popover from '$lib/components/ui/popover';
	import { Tooltip as TooltipPrimitive } from 'bits-ui';
	import Button from '../ui/button/button.svelte';
	import { fade } from 'svelte/transition';

	let {
		open = $bindable(true),
		items = [],
		side = 'bottom',
		arrowClasses,
		class: className
	}: {
		open?: boolean;
		items: Item[];
		side?: TooltipPrimitive.ContentProps['side'];
		arrowClasses?: string;
		class?: string;
	} = $props();

	let current = $state(0);

	function getOpen() {
		return open;
	}

	function setOpen(newOpen: boolean) {
		open = newOpen;
	}

	const currentItem = $derived(items[current]);
	const scrimStyle = $derived.by(() => {
		if (!currentItem.target) return '';
		const boundingRect = currentItem.target.getBoundingClientRect();
		const left = boundingRect.left;
		const right = left + boundingRect.width;
		const top = boundingRect.top;
		const bottom = top + boundingRect.height;
		const { innerHeight, innerWidth } = window;
		return `
      clip-path: polygon(
        0px 0px,
        0px ${innerHeight}px,
        ${left}px ${innerHeight}px,
        ${left}px ${top}px,
        ${right}px ${top}px,
        ${right}px ${bottom}px,
        ${left}px ${bottom}px,
        ${left}px ${innerHeight}px,
        ${innerWidth}px ${innerHeight}px,
        ${innerWidth}px 0px
      );
    `;
	});
</script>

<Popover.Root>
	<Popover.Root bind:open={getOpen, setOpen}>
		<Popover.Content
			class={className}
			collisionPadding={20}
			customAnchor={currentItem.target}
			side={currentItem.side ?? side}
			interactOutsideBehavior="ignore"
		>
			<Popover.Close
				class="ring-offset-background focus:ring-ring float-right rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
			>
				<IconX />
				<span class="sr-only">Close</span>
			</Popover.Close>
			<p class="text-sm leading-tight whitespace-pre-wrap">{currentItem.text}</p>
			<footer class="mt-2 flex">
				<Button
					variant="outline"
					disabled={current <= 0}
					onclick={() => {
						current -= 1;
					}}>Back</Button
				>
				<span class="grow"></span>
				<Button
					onclick={() => {
						if (current + 1 >= items.length) {
							open = false;
							return;
						}
						current += 1;
					}}>{current + 1 >= items.length ? 'Done' : 'Next'}</Button
				>
			</footer>
			<Popover.Arrow>
				{#snippet child({ props })}
					<div
						class={cn(
							'bg-popover z-50 size-2.5 rotate-45 rounded-[2px] border-r border-b',
							'data-[side=top]:translate-x-1/2 data-[side=top]:translate-y-[calc(-50%_+_2px)]',
							'data-[side=bottom]:-translate-x-1/2 data-[side=bottom]:-translate-y-[calc(-50%_+_1px)]',
							'data-[side=right]:translate-x-[calc(50%_+_2px)] data-[side=right]:translate-y-1/2',
							'data-[side=left]:-translate-y-[calc(50%_-_3px)]',
							arrowClasses
						)}
						{...props}
					></div>
				{/snippet}
			</Popover.Arrow>
		</Popover.Content>
		{#if open}
			<div
				transition:fade
				class="fixed inset-0 z-50 bg-black/50 transition-[clip-path]"
				style={scrimStyle}
			></div>
		{/if}
	</Popover.Root>
</Popover.Root>

<!-- <div -->
<!-- 	class={cn( -->
<!-- 		'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--bits-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden', -->
<!-- 		className -->
<!-- 	)} -->
<!-- > -->
<!-- 	<TooltipPrimitive.Arrow> -->
<!-- 		{#snippet child({ props })} -->
<!-- 			<div -->
<!-- 				class={cn( -->
<!-- 					'bg-primary z-50 size-2.5 rotate-45 rounded-[2px]', -->
<!-- 					side === 'top' && 'translate-x-1/2 translate-y-[calc(-50%_+_2px)]', -->
<!-- 					side === 'bottom' && '-translate-x-1/2 -translate-y-[calc(-50%_+_1px)]', -->
<!-- 					side === 'right' && 'translate-x-[calc(50%_+_2px)] translate-y-1/2', -->
<!-- 					side === 'left' && '-translate-y-[calc(50%_-_3px)]', -->
<!-- 					arrowClasses -->
<!-- 				)} -->
<!-- 				{...props} -->
<!-- 			></div> -->
<!-- 		{/snippet} -->
<!-- 	</TooltipPrimitive.Arrow> -->
<!-- </div> -->
<!-- </Portal> -->
