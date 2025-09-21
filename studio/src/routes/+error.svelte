<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Sidebar from '$lib/components/ui/sidebar';

	import { Separator } from '$lib/components/ui/separator';

	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { page } from '$app/state';
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
						<Breadcrumb.Link>{page.status}</Breadcrumb.Link>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>
		<main class="flex grow flex-col items-center justify-center">
			<h1 class="text-5xl font-bold">{page.status}</h1>
			<p class="text-xl">{page.error?.message}</p>
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
