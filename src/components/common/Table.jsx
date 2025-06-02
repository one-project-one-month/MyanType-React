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
                    table.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td colSpan={table.getAllColumns().length} className={'text-center py-8 text-xl text-slate-500'}>No Results Found</td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map((row, i) => (
                            <tr key={row.id} className={
                                `${i % 2 === 0 ? 'bg-[#141723]' : 'bg-[#0E0F15]'}`
                            }>
                                {
                                    row.getVisibleCells().map((cell, i) => (
                                        <td key={cell.id} className={`
                                    text-[14px] font-base px-4.5 py-4
                                    ${i === 0 ? 'rounded-l-sm' : ''}
                                    ${i === row.getVisibleCells().length - 1 ? 'rounded-r-sm' : ''}
                                `}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    )

                }
                </tbody>
            </table>
            <div className="block tracking-wider sm:hidden">
                {table.getRowModel().rows.map(row => (
                    <div key={row.id} className="border border-[#3A3A67]/[0.32] rounded-xl p-4 mb-4">
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