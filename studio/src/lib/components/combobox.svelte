<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { tick, type ComponentProps, type Snippet } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	let {
		open = $bindable(false),
		value = $bindable(''),
		selectPlaceholder = 'Select an item...',
		searchPlaceholder = 'Search items...',
		emptyLabel = 'No items found.',
		options = [],
		onValueChange,

		side,
		align,

		option: optionChild,
		trigger
	}: {
		open?: boolean;
		value?: string;
		options?: string[];
		selectPlaceholder?: string;
		searchPlaceholder?: string;
		emptyLabel?: string;
		onValueChange?: (value: string) => void;

		side?: ComponentProps<typeof Popover.Content>['side'];
		align?: ComponentProps<typeof Popover.Content>['align'];

		option?: Snippet<[{ option: string }]>;
		trigger?: Snippet<[{ props: Record<string, unknown> }]>;
	} = $props();

	let triggerRef = $state<HTMLButtonElement>(null!);
	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			{#if trigger}
				{@render trigger({ props })}
			{:else}
				<Button
					variant="outline"
					class="w-[200px] justify-between"
					{...props}
					role="combobox"
					aria-expanded={open}
				>
					{value || selectPlaceholder}
					<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
				</Button>
			{/if}
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0" {side} {align}>
		<Command.Root>
			<Command.Input placeholder={searchPlaceholder} />
			<Command.List>
				<Command.Empty>{emptyLabel}</Command.Empty>
				<Command.Group>
					{#each options as option}
						<Command.Item
							value={option}
							onSelect={() => {
								value = option;
								onValueChange?.(value);
								closeAndFocusTrigger();
							}}
						>
							{#if optionChild}
								{@render optionChild({ option })}
							{:else}
								<CheckIcon class={cn('mr-2 size-4', value !== option && 'text-transparent')} />
								{option}
							{/if}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
