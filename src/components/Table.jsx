import {flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";

export default function Table({ columns, data }) {
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <table className={'text-right w-full'}>
            <thead>
                {
                    table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {
                                headerGroup.headers.map(header => (
                                    <th key={header.id} className={header.column.id === 'name' ? 'text-left capitalize px-3.5 py-4 text-slate-500 text-[14px] font-normal' : 'capitalize px-3.5 py-4 text-slate-500 text-[14px] font-normal'}>
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
                            `${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}`
                        }>
                            {
                                row.getVisibleCells().map((cell, i) => (
                                    <td key={cell.id} className={`
                                        text-[15px] font-medium px-3.5 py-4.5
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
    );
}