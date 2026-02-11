import { useEffect, useMemo, useState } from 'react';
import type {
	LinkDraft,
	LinkItem,
	SortDirection,
	SortField,
} from '../domain/linkTypes';
import {
	compareLinks,
	containsCI,
	getPreviewFromInternet,
	isBlank,
	isValidUrl,
	normalizeUrl,
	now,
	uid,
} from '../domain/linkUtils';
import { loadLinks, saveLinks } from '../storage/linksStorage';

type UseLinksState = {
	items: LinkItem[];
	search: string;
	sortField: SortField;
	sortDir: SortDirection;
	editingId: string | null;
	draft: LinkDraft;
	error: string | null;
};

type UseLinksApi = {
	setSearch: (v: string) => void;
	setSortField: (v: SortField) => void;
	setSortDir: (v: SortDirection) => void;
	setDraft: (updater: (prev: LinkDraft) => LinkDraft) => void;
	beginCreate: () => void;
	beginEdit: (id: string) => void;
	upsert: () => void;
	remove: (id: string) => void;
	openLink: (id: string) => void;
	syncPreviews: () => void;
	clearAll: () => void;
	filteredSorted: LinkItem[];
};

export const useLinks = (): UseLinksState & UseLinksApi => {
	const [items, setItems] = useState<LinkItem[]>([]);
	const [search, setSearch] = useState('');
	const [sortField, setSortField] = useState<SortField>('updatedAt');
	const [sortDir, setSortDir] = useState<SortDirection>('desc');
	const [editingId, setEditingId] = useState<string | null>(null);
	const [draft, setDraftInner] = useState<LinkDraft>({
		url: '',
		title: '',
		description: '',
	});
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setItems(loadLinks());
	}, []);

	useEffect(() => {
		saveLinks(items);
	}, [items]);

	const setDraft = (updater: (prev: LinkDraft) => LinkDraft) => {
		setDraftInner((prev) => updater(prev));
	};

	const resetDraft = () =>
		setDraftInner({ url: '', title: '', description: '' });

	const beginCreate = () => {
		setEditingId(null);
		resetDraft();
		setError(null);
	};

	const beginEdit = (id: string) => {
		const found = items.find((x) => x.id === id);
		if (!found) return;
		setEditingId(id);
		setDraftInner({
			url: found.url,
			title: found.title,
			description: found.description,
		});
		setError(null);
	};

	const upsert = () => {
		const normalized = normalizeUrl(draft.url);
		const title = draft.title.trim();
		const description = draft.description.trim();

		if (isBlank(normalized)) {
			setError('Вкажіть посилання (URL).');
			return;
		}
		if (!isValidUrl(normalized)) {
			setError('Некоректний URL. Дозволено лише http/https.');
			return;
		}
		if (isBlank(title)) {
			setError('Вкажіть назву (text).');
			return;
		}

		setError(null);

		if (!editingId) {
			const ts = now();
			const item: LinkItem = {
				id: uid(),
				url: normalized,
				title,
				description,
				createdAt: ts,
				updatedAt: ts,
				clicks: 0,
				previewUrl: null,
			};
			setItems((prev) => [item, ...prev]);
			resetDraft();
			return;
		}

		setItems((prev) =>
			prev.map((x) => {
				if (x.id !== editingId) return x;
				return {
					...x,
					url: normalized,
					title,
					description,
					updatedAt: now(),
				};
			}),
		);
	};

	const remove = (id: string) => {
		setItems((prev) => prev.filter((x) => x.id !== id));
		if (editingId === id) {
			setEditingId(null);
			resetDraft();
			setError(null);
		}
	};

	const openLink = (id: string) => {
		const found = items.find((x) => x.id === id);
		if (!found) return;
		window.open(found.url, '_blank', 'noopener,noreferrer');
		setItems((prev) =>
			prev.map((x) =>
				x.id === id
					? { ...x, clicks: x.clicks + 1, updatedAt: now() }
					: x,
			),
		);
	};

	const syncPreviews = () => {
		setItems((prev) =>
			prev.map((x) => {
				if (x.previewUrl) return x;
				const previewUrl = getPreviewFromInternet(x.url);
				if (!previewUrl) return x;
				return { ...x, previewUrl, updatedAt: now() };
			}),
		);
	};

	const clearAll = () => {
		setItems([]);
		setEditingId(null);
		resetDraft();
		setError(null);
	};

	const filteredSorted = useMemo(() => {
		const q = search.trim();
		const base = q
			? items.filter(
					(x) =>
						containsCI(x.url, q) ||
						containsCI(x.title, q) ||
						containsCI(x.description, q),
				)
			: items.slice();
		return base.sort((a, b) => compareLinks(a, b, sortField, sortDir));
	}, [items, search, sortField, sortDir]);

	return {
		items,
		search,
		sortField,
		sortDir,
		editingId,
		draft,
		error,
		setSearch,
		setSortField,
		setSortDir,
		setDraft,
		beginCreate,
		beginEdit,
		upsert,
		remove,
		openLink,
		syncPreviews,
		clearAll,
		filteredSorted,
	};
};
