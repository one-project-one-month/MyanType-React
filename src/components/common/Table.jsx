import {flexRender} from "@tanstack/react-table";

export default function Table({ table }) {
    return (
        <div>
            <table className={'text-right min-w-full hidden tracking-wider sm:table'}>
                <thead>
                {
                    table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {
                                headerGroup.headers.map(header => (
                                    <th key={header.id} className={header.column.id === 'name' ? 'text-left capitalize px-4.5 py-4 text-slate-500 text-[14px] font-normal' : 'capitalize px-4.5 py-4 text-slate-500 text-[14px] font-normal'}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))
                            }
                        </tr>
                    ))
                }
                </thead>
                <tbody>
                {
                    table.getRowModel().rows.map((row, i) => (
                        <tr key={row.id} className={
                            `${i % 2 === 0 ? 'bg-[#141723]' : 'bg-[#0E0F15]'}`
                        }>
                            {
                                row.getVisibleCells().map((cell, i) => (
                                    <td key={cell.id} className={`
                                    text-[15px] font-base px-4.5 py-4.5
                                    ${i === 0 ? 'rounded-l-lg' : ''}
                                    ${i === row.getVisibleCells().length - 1 ? 'rounded-r-lg' : ''}
                                `}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))
                            }
                        </tr>
                    ))
                }
                </tbody>
            </table>
            <div className="block tracking-wider sm:hidden">
                {table.getRowModel().rows.map(row => (
                    <div key={row.id} className="border border-zinc-700 rounded-lg p-4 mb-2">
                        {row.getVisibleCells().map(cell => (
                            <div key={cell.id} className="flex justify-between text-sm py-1">
                                <span className="font-medium text-gray-50">{flexRender(cell.column.columnDef.header, cell.getContext())}</span>
                                <span className="text-gray-50">{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}