<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Sidebar from '$lib/components/ui/sidebar';

	import Input from '$lib/components/ui/input/input.svelte';
	import { Separator } from '$lib/components/ui/separator';

	import AppSidebar from '$lib/components/app-sidebar.svelte';

	import { socketCtx } from '$lib/socket.svelte';

	let ctx = socketCtx.get();
	let userQuestions: Record<string, string> = $state({});

	let requests = $derived(Object.values(ctx.userInput.requests ?? {}));
	$effect(() => {
		for (const request of requests) {
			if (request.userQuestion !== undefined) {
				userQuestions[request.id] = request.userQuestion;
			}
		}
	});
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
						<Breadcrumb.Link>Tools</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="hidden md:block" />
					<Breadcrumb.Item>
						<Breadcrumb.Page>User Input Tool</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>
		<main class="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 lg:grid-cols-3">
			{#if requests.length == 0}
				<p class="text-muted-foreground col-span-full text-center text-sm">No requests yet.</p>
			{/if}
			{#each requests as request}
				<Card.Root>
					<Card.Header>
						<h2 class="text-muted-foreground text-sm">{request.sessionId}</h2>
						<h1>'{request.agentId}' asks:</h1>
						<q>{request.agentRequest}</q>
					</Card.Header>
					<Card.Content>
						<Input
							bind:value={userQuestions[request.id]}
							disabled={request.userQuestion !== undefined}
							placeholder="Enter your reply."
							onkeydown={(e) => {
								if (e.key != 'Enter') return;
								ctx.userInput.respond(request.id, userQuestions[request.id]);
							}}
						/>
						<p>{request.agentAnswer}</p>
					</Card.Content>
				</Card.Root>
			{/each}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
