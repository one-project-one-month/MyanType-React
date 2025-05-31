import {useMemo, useState} from "react";
import {histories} from "@/data.js";
import {createColumnHelper, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {Crown} from "lucide-react";

export default function useHistory() {
    const [data] = useState([...histories]);

    const maxWPMByMode = useMemo(() => {
        const max15 = Math.max(...data.filter(row => row.mode === 15).map(row => row.wpm));
        const max60 = Math.max(...data.filter(row => row.mode === 60).map(row => row.wpm));

        return {
            15: max15,
            60: max60,
        }
    }, [data]);

    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor('', {
            cell: info => {
                const row = info.row.original;
                const maxMode = maxWPMByMode[row.mode];
                const isMaxMode = row.wpm === maxMode;

                return (
                    <span className={'flex justify-end'}>
                        {
                            isMaxMode ? <Crown className={'h-5 w-5 text-yellow-400'} /> : '-'
                        }
                    </span>
                )
            },
            header: '#',
        }),
        columnHelper.accessor('formattedWpm', { cell: info => <span>{info.getValue()}</span>, header: 'WPM' }),
        columnHelper.accessor('accuracy', { cell: info => <span>{info.getValue()}</span>, header: 'ACCURACY' }),
        columnHelper.accessor('raw', { cell: info => <span>{info.getValue()}</span>, header: 'RAW' }),
        columnHelper.accessor('consistency', { cell: info => <span>{info.getValue()}</span>, header: 'CONSISTENCY' }),
        {
            id: 'character',
            header: 'CHARACTERS',
            cell: info => {
                const { correct, wrong } = info.row.original;
                return (
                    <span>{correct} / {wrong}</span>
                )
            }
        },
        columnHelper.accessor('language', { cell: info => <span>{ info.getValue()}</span>, header: 'LANGUAGE' }),
        columnHelper.accessor('mode', { cell: info => <span>{info.getValue()}s</span>, header: 'MODE' }),
        columnHelper.accessor('date', { cell: info => <span>{info.getValue()}</span>, header: 'DATE' }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return table;
}