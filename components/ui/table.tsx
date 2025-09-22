import * as React from 'react';
export const Table=(p:React.TableHTMLAttributes<HTMLTableElement>)=><table {...p} className={"w-full border-collapse "+(p.className??"")} />;
export const THead=(p:React.HTMLAttributes<HTMLTableSectionElement>)=><thead {...p}/>;
export const TBody=(p:React.HTMLAttributes<HTMLTableSectionElement>)=><tbody {...p}/>;
export const TR=(p:React.HTMLAttributes<HTMLTableRowElement>)=><tr {...p} className={"border-b border-neutral-200 "+(p.className??"")} />;
export const TH=(p:React.ThHTMLAttributes<HTMLTableCellElement>)=><th {...p} className={"bg-neutral-100 px-3 py-2 text-left text-sm font-medium "+(p.className??"")} />;
export const TD=(p:React.TdHTMLAttributes<HTMLTableCellElement>)=><td {...p} className={"px-3 py-2 text-sm "+(p.className??"")} />;
