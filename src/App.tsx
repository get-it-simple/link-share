import React, { useEffect, useRef } from 'react';
import type { SortDirection, SortField } from './domain/linkTypes';
import { formatDateTime, getDomain } from './domain/linkUtils';
import { useLinks } from './hooks/useLinks';
import { Textarea } from './ui/Textarea';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';

export default function App() {
	const {
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
	} = useLinks();

	const urlRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		setTimeout(() => urlRef.current?.focus(), 0);
	}, []);

	const isEditing = Boolean(editingId);

	return (
		<div className='min-h-screen bg-slate-950 text-slate-100'>
			<div className='mx-auto max-w-6xl p-4 sm:p-6'>
				<div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
					<div>
						<h1 className='text-xl font-semibold tracking-tight sm:text-2xl'>
							Links Share Storage
						</h1>
						<p className='mt-1 text-sm text-slate-400'>
							LocalStorage + пошук (OR) + сортування + clicks +
							sync previews.
						</p>
					</div>

					<div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
						<Button variant='ghost' onClick={syncPreviews}>
							Sync previews
						</Button>
						<Button
							variant='ghost'
							onClick={() => {
								beginCreate();
								setTimeout(() => urlRef.current?.focus(), 0);
							}}
						>
							Нове посилання
						</Button>
						<Button
							variant='danger'
							onClick={clearAll}
							disabled={items.length === 0}
						>
							Очистити все
						</Button>
					</div>
				</div>

				<div className='mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3'>
					<div className='rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow-sm lg:col-span-1'>
						<div className='flex items-center justify-between'>
							<h2 className='text-base font-semibold'>
								{isEditing ? 'Редагування' : 'Додавання'}
							</h2>
							{isEditing ? (
								<Button
									variant='ghost'
									onClick={() => {
										beginCreate();
										setTimeout(
											() => urlRef.current?.focus(),
											0,
										);
									}}
								>
									Скасувати
								</Button>
							) : null}
						</div>

						<div className='mt-4 space-y-3'>
							<div className='space-y-1'>
								<div className='text-xs font-medium text-slate-300'>
									Посилання (URL)
								</div>
								<Input
									ref={(el) => {
										urlRef.current = el;
									}}
									value={draft.url}
									onChange={(e) =>
										setDraft((d) => ({
											...d,
											url: e.target.value,
										}))
									}
									placeholder='https://example.com або example.com'
								/>
							</div>

							<div className='space-y-1'>
								<div className='text-xs font-medium text-slate-300'>
									Текст (назва)
								</div>
								<Input
									value={draft.title}
									onChange={(e) =>
										setDraft((d) => ({
											...d,
											title: e.target.value,
										}))
									}
									placeholder='Напр. Документація'
								/>
							</div>

							<div className='space-y-1'>
								<div className='text-xs font-medium text-slate-300'>
									Опис
								</div>
								<Textarea
									rows={4}
									value={draft.description}
									onChange={(e) =>
										setDraft((d) => ({
											...d,
											description: e.target.value,
										}))
									}
									placeholder='Короткий опис...'
								/>
							</div>

							{error ? (
								<div className='rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200'>
									{error}
								</div>
							) : null}

							<div className='flex gap-2'>
								<Button className='flex-1' onClick={upsert}>
									{isEditing ? 'Зберегти' : 'Додати'}
								</Button>
								<Button
									variant='ghost'
									onClick={() => {
										setDraft(() => ({
											url: '',
											title: '',
											description: '',
										}));
										urlRef.current?.focus();
									}}
								>
									Очистити
								</Button>
							</div>
						</div>
					</div>

					<div className='rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow-sm lg:col-span-2'>
						<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
							<div className='flex flex-1 flex-col gap-2 sm:flex-row sm:items-center'>
								<Input
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder='Пошук по url або назві або опису (OR)'
								/>
							</div>

							<div className='grid grid-cols-2 gap-2 sm:w-[420px]'>
								<Select
									value={sortField}
									onChange={(e) =>
										setSortField(
											e.target.value as SortField,
										)
									}
								>
									<option value='createdAt'>
										Дата створення
									</option>
									<option value='updatedAt'>
										Дата редагування
									</option>
									<option value='title'>Назва</option>
									<option value='clicks'>Clicks</option>
								</Select>

								<Select
									value={sortDir}
									onChange={(e) =>
										setSortDir(
											e.target.value as SortDirection,
										)
									}
								>
									<option value='asc'>ASC</option>
									<option value='desc'>DESC</option>
								</Select>
							</div>
						</div>

						<div className='mt-4 flex items-center justify-between'>
							<div className='text-sm text-slate-400'>
								Всього:{' '}
								<span className='text-slate-200'>
									{items.length}
								</span>{' '}
								• Показано:{' '}
								<span className='text-slate-200'>
									{filteredSorted.length}
								</span>
							</div>
						</div>

						<div className='mt-4 divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-800'>
							{filteredSorted.length === 0 ? (
								<div className='p-6 text-sm text-slate-400'>
									Нічого не знайдено.
								</div>
							) : (
								filteredSorted.map((x) => (
									<div
										key={x.id}
										className='flex items-start gap-3 bg-slate-950/30 p-4'
									>
										<div className='mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-900'>
											{x.previewUrl ? (
												<img
													src={x.previewUrl}
													alt=''
													className='h-full w-full object-cover'
												/>
											) : (
												<div className='text-xs font-semibold text-slate-400'>
													{getDomain(x.url)
														.slice(0, 2)
														.toUpperCase()}
												</div>
											)}
										</div>

										<div className='min-w-0 flex-1'>
											<div className='flex flex-wrap items-center gap-2'>
												<button
													onClick={() =>
														openLink(x.id)
													}
													className='max-w-full truncate text-left text-sm font-semibold text-indigo-300 hover:text-indigo-200'
													title={x.url}
												>
													{x.title}
												</button>
												<Badge>{x.clicks} clicks</Badge>
												<span className='text-xs text-slate-500'>
													створено:{' '}
													{formatDateTime(
														x.createdAt,
													)}
												</span>
												<span className='text-xs text-slate-500'>
													оновлено:{' '}
													{formatDateTime(
														x.updatedAt,
													)}
												</span>
											</div>

											<div
												className='mt-1 truncate text-sm text-slate-400'
												title={x.url}
											>
												{x.url}
											</div>

											{x.description ? (
												<div className='mt-2 line-clamp-3 text-sm text-slate-300'>
													{x.description}
												</div>
											) : null}

											<div className='mt-3 flex flex-wrap gap-2'>
												<Button
													variant='ghost'
													onClick={() =>
														openLink(x.id)
													}
												>
													Open
												</Button>
												<Button
													variant='ghost'
													onClick={() =>
														beginEdit(x.id)
													}
												>
													Edit
												</Button>
												<Button
													variant='danger'
													onClick={() => remove(x.id)}
												>
													Delete
												</Button>
											</div>
										</div>
									</div>
								))
							)}
						</div>

						<div className='mt-4 text-xs text-slate-500'>
							Sync previews підтягує favicon домену (стабільно
							працює в браузері без CORS проблем).
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
