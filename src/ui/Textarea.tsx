import React from 'react';

export const Textarea: React.FC<
	React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className = '', ...props }) => {
	return (
		<textarea
			className={`w-full resize-none rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${className}`}
			{...props}
		/>
	);
};
