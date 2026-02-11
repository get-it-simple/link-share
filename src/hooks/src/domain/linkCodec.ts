import { LinkItem } from '../../../domain/linkTypes';
import { now, uid } from '../../../domain/linkUtils';

const isRecord = (v: unknown): v is Record<string, unknown> =>
	typeof v === 'object' && v !== null;

const asString = (v: unknown) => (typeof v === 'string' ? v : '');
const asNumber = (v: unknown) =>
	typeof v === 'number' && Number.isFinite(v) ? v : 0;
const asNullableString = (v: unknown) => (typeof v === 'string' ? v : null);

const normalizeImportedItem = (raw: unknown): LinkItem | null => {
	if (!isRecord(raw)) return null;

	const url = asString(raw.url).trim();
	const title = asString(raw.title).trim();
	const description = asString(raw.description).trim();

	if (!url || !title) return null;

	const createdAt = asNumber(raw.createdAt) || now();
	const updatedAt = asNumber(raw.updatedAt) || createdAt;
	const clicks = Math.max(0, Math.floor(asNumber(raw.clicks)));

	const idRaw = asString(raw.id).trim();
	const id = idRaw ? idRaw : uid();

	const previewUrl = asNullableString(raw.previewUrl);

	return {
		id,
		url,
		title,
		description,
		createdAt,
		updatedAt,
		clicks,
		previewUrl,
	};
};

export const exportToJsonString = (items: LinkItem[]) => {
	const payload = {
		schema: 'links_share_storage_v1',
		exportedAt: now(),
		items,
	};
	return JSON.stringify(payload, null, 2);
};

export const importFromJsonString = (json: string) => {
	const parsed = JSON.parse(json) as unknown;

	if (!isRecord(parsed)) return { items: [] as LinkItem[] };

	const rawItems = Array.isArray(parsed.items)
		? parsed.items
		: Array.isArray(parsed)
			? parsed
			: [];
	const items = rawItems
		.map(normalizeImportedItem)
		.filter(Boolean) as LinkItem[];

	return { items };
};

export const mergeById = (current: LinkItem[], incoming: LinkItem[]) => {
	const map = new Map<string, LinkItem>();
	for (const x of current) map.set(x.id, x);
	for (const x of incoming) {
		const existing = map.get(x.id);
		if (!existing) {
			map.set(x.id, x);
			continue;
		}
		const pick = x.updatedAt >= existing.updatedAt ? x : existing;
		map.set(x.id, pick);
	}
	return Array.from(map.values());
};
