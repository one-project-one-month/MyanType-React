import {useQuery} from "@tanstack/react-query";
import axios from "@/lib/axios.js";
import {createColumnHelper, getCoreRowModel, useReactTable} from "@tanstack/react-table";

const columnHelper = createColumnHelper();
const columns = [
    columnHelper.display( {
        id: 'crown',
        cell: info => {
            const row = info.row.original;
            const isTop = row.isTop;
            return (
                <span className="flex justify-end">
                    {isTop ? <Crown className="h-5 w-5 text-yellow-400" /> : "-"}
                </span>
            )
        },
        header: '#',
    }),
    columnHelper.accessor('wpm', { header: 'WPM' }),
    columnHelper.accessor('accuracy', { header: 'ACCURACY', cell: info => `${info.getValue()}%` }),
    columnHelper.accessor('raw', { header: 'RAW', cell: info => `${info.getValue()}%` }),
    columnHelper.accessor('consistency', { header: 'CONSISTENCY' }),
    columnHelper.display({
        id: 'charactersTyped',
        header: 'CHARACTERS',
        cell: info => {
            const { correct, incorrect } = info.row.original;
            return (
                <span>{correct} / {incorrect}</span>
            )
        }
    }),
    columnHelper.accessor('language', { header: 'LANGUAGE' }),
    columnHelper.accessor('timeTaken', { header: 'MODE' }),
];

export default function useHistoryBackup() {
    const { data = [], isLoading, isError } = useQuery({
        queryKey: ['history'],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const res = await axios.get('/me');
            const rows = res.data || {};

            const maxWpmByMode = {};
            rows.forEach(r => {
                const key = r.timeLimit;
                if (!maxWpmByMode[key] || r.wpm > maxWpmByMode[key]) {
                    maxWpmByMode[key] = r.wpm;
                }
            });

            return rows.map(r => ({
                ...r,
                isTop: r.wpm === maxWpmByMode[r.timeLimit],
            }));
        },
        staleTime: 60 * 1000,
    })

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return {
        table,
        isLoading,
        isError,
    }
}

