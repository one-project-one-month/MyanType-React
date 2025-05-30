import {useQuery} from "@tanstack/react-query";
import axios from "@/lib/axios.js";
import {createColumnHelper, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {Trophy} from "lucide-react";

const columnHelper = createColumnHelper();
const columns = [
    columnHelper.display( {
        id: 'crown',
        cell: info => {
            const row = info.row.original;
            const isTop = row.isTop;
            return (
                <span className="flex justify-end">
                    {isTop ? <Trophy className="h-5 w-5 text-yellow-400" /> : "-"}
                </span>
            )
        },
        header: '#',
    }),
    columnHelper.accessor('wpm', { header: 'Wpm' }),
    columnHelper.accessor('accuracy', { header: 'Accuracy', cell: info => `${info.getValue()}%` }),
    columnHelper.accessor('raw', { header: 'Raw', cell: info => `${info.getValue()}%` }),
    columnHelper.accessor('consistency', { header: 'Consistency' }),
    columnHelper.display({
        id: 'charactersTyped',
        header: 'Characters',
        cell: info => {
            const { correct, incorrect } = info.row.original;
            return (
                <span>{correct} / {incorrect}</span>
            )
        }
    }),
    columnHelper.display({
        id: 'mode',
        header: 'Mode',
        cell: info => {
            const { timeLimit, wordLimit, mode } = info.row.original;
            return (
                <span>
                    {mode.toLocaleLowerCase()} {mode === 'Time' ? timeLimit : wordLimit}
                </span>
            )
        }
    }),
    columnHelper.accessor('createdAt', {
        header: 'Date',
        cell: info => {
            const date = new Date(info.getValue());
            return date.toLocaleString();
        }
    }),
];

export default function useHistory() {
    const { data = [], isLoading, isError } = useQuery({
        queryKey: ['history'],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const res = await axios.get('/me');
            const rows = res.data.data || {};

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

