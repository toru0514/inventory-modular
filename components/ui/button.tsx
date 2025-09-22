import * as React from 'react'; import { clsx } from 'clsx';
export function Button(p:React.ButtonHTMLAttributes<HTMLButtonElement>){return <button {...p} className={clsx("inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-neutral-100 disabled:opacity-50", p.className)} />}
export default Button;
