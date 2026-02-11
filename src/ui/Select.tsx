import React from 'react';

export const Select: React.FC<
	React.SelectHTMLAttributes<HTMLSelectElement>
> = ({ className = '', ...props }) => {
	return (
		<select
			className={`w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${className}`}
			{...props}
		/>
	);
};
