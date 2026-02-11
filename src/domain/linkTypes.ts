export type SortField = 'createdAt' | 'updatedAt' | 'title' | 'clicks';
export type SortDirection = 'asc' | 'desc';

export type LinkItem = {
	id: string;
	url: string;
	title: string;
	description: string;
	createdAt: number;
	updatedAt: number;
	clicks: number;
	previewUrl: string | null;
};

export type LinkDraft = {
	url: string;
	title: string;
	description: string;
};
