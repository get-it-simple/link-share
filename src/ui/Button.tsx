import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'ghost' | 'danger';
};

export const Button: React.FC<Props> = ({
	variant = 'primary',
	className = '',
	...props
}) => {
	const base =
		'inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950';
	const styles =
		variant === 'primary'
			? 'bg-indigo-500 text-white hover:bg-indigo-400 focus:ring-indigo-400'
			: variant === 'danger'
				? 'bg-rose-500 text-white hover:bg-rose-400 focus:ring-rose-400'
				: 'bg-slate-800 text-slate-100 hover:bg-slate-700 focus:ring-slate-500';
	return <button className={`${base} ${styles} ${className}`} {...props} />;
};
