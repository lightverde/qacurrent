import type { Handle } from '@sveltejs/kit';
import * as mcptools from '$lib/server/mcptools';

export const handle: Handle = async (params) => {
	const { event, resolve } = params;
	if (event.url.pathname.startsWith('/api/mcp-tools/')) {
		return mcptools.handle(params);
	}
	const response = await resolve(event);
	return response;
};
