import type { LinkItem } from '../domain/linkTypes';

const STORAGE_KEY = 'links_share_storage_v1';

export const loadLinks = (): LinkItem[] => {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw) as unknown;
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(Boolean) as LinkItem[];
	} catch {
		return [];
	}
};

export const saveLinks = (items: LinkItem[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};
