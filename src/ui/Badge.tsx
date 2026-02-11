import React from 'react';

export const Badge: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return (
		<span className='inline-flex items-center rounded-full bg-slate-800 px-2 py-1 text-xs font-medium text-slate-200'>
			{children}
		</span>
	);
};
