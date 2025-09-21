<script lang="ts">
	import { page } from '$app/state';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import Input from '$lib/components/ui/input/input.svelte';
	import ScrollAreaScrollbar from '$lib/components/ui/scroll-area/scroll-area-scrollbar.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Resizable from '$lib/components/ui/resizable';
	import { sessionCtx } from '$lib/threads';
	import { useDebounce, useIntersectionObserver } from 'runed';
	import { onMount } from 'svelte';
	import Message from './Message.svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { cn } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Users } from '@lucide/svelte';
	import { pickTextColor, stringToColor } from '$lib/color';
	import ThreadView from './ThreadView.svelte';

	let ctx = sessionCtx.get();
	let conn = $derived(ctx.session);
	let thread = $derived(conn?.threads[page.params['thread']]);
	let messages = $derived(conn?.messages[page.params['thread']]);

	let memberListOpen = $state(true);

	afterNavigate(useDebounce(() => thread && (thread.unread = 0), 1000));
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header class="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Breadcrumb.Root class="flex-grow">
				<Breadcrumb.List>
					<Breadcrumb.Item class="hidden md:block">
						<Breadcrumb.Link>Threads</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="hidden md:block" />
					<Breadcrumb.Item>
						<Breadcrumb.Page>{thread?.name ?? ''} {thread?.id ?? ''}</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
			<Button
				variant="ghost"
				size="icon"
				onclick={() => {
					memberListOpen = !memberListOpen;
				}}
			>
				<Users />
			</Button>
		</header>
		{#if thread !== undefined && messages !== undefined}
			<ThreadView {thread} {messages} {memberListOpen} />
		{:else}
			<p class="text-muted-foreground mt-4 text-center text-sm">Thread not found.</p>
		{/if}
	</Sidebar.Inset>
</Sidebar.Provider>
