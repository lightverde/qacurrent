export function hexToRgb(hex: string) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			}
		: null;
}
export const stringToColor = (string: string) => {
	let hash = 0;
	for (let i = 0; i < string.length; i++) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}
	let color = '#';
	for (let i = 0; i < 3; i++) {
		let value = (hash >> (i * 8)) & 0xff;
		color += ('00' + value.toString(16)).substr(-2);
	}
	return color;
};

export const pickTextColor = (bg: string) => {
	const rgb = hexToRgb(bg);
	if (!rgb) return null;
	const { r, g, b } = rgb;
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq < 140 ? 'text-white' : 'text-black';
};
