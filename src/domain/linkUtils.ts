import type { LinkItem, SortDirection, SortField } from './linkTypes';

export const now = () => Date.now();

export const uid = () => {
	const a = crypto.getRandomValues(new Uint8Array(16));
	const s = Array.from(a, (b) => b.toString(16).padStart(2, '0')).join('');
	return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`;
};

export const isBlank = (v: string) => v.trim().length === 0;

export const normalizeUrl = (raw: string) => {
	const trimmed = raw.trim();
	if (trimmed.length === 0) return '';
	const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed);
	return hasScheme ? trimmed : `https://${trimmed}`;
};

export const isValidUrl = (value: string) => {
	try {
		const u = new URL(value);
		return u.protocol === 'http:' || u.protocol === 'https:';
	} catch {
		return false;
	}
};

export const getDomain = (url: string) => {
	try {
		return new URL(url).hostname;
	} catch {
		return '';
	}
};

export const getPreviewFromInternet = (url: string) => {
	const domain = getDomain(url);
	if (!domain) return null;
	const encoded = encodeURIComponent(`https://${domain}`);
	return `https://www.google.com/s2/favicons?domain_url=${encoded}&sz=128`;
};

export const containsCI = (haystack: string, needle: string) =>
	haystack.toLowerCase().includes(needle.toLowerCase());

export const compareLinks = (
	a: LinkItem,
	b: LinkItem,
	field: SortField,
	dir: SortDirection,
) => {
	const m = dir === 'asc' ? 1 : -1;
	if (field === 'title')
		return (
			m *
			a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
		);
	if (field === 'clicks') return m * (a.clicks - b.clicks);
	if (field === 'createdAt') return m * (a.createdAt - b.createdAt);
	return m * (a.updatedAt - b.updatedAt);
};

export const formatDateTime = (ts: number) => {
	const d = new Date(ts);
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(
		d.getMinutes(),
	)}`;
};
