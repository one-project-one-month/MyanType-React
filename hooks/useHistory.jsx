import {useQuery} from "@tanstack/react-query";
import {createColumnHelper, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {Trophy} from "lucide-react";
import api from "@/api/axiosConfig.js";

const columnHelper = createColumnHelper();
const columns = [
    columnHelper.accessor('#', {
       header: '#',
       cell: info => <span>-</span>
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
                    {mode.toLocaleLowerCase()} {mode === 'TIME' ? timeLimit : wordLimit}
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
            const res = await api.get('/me');
            return res.data.data;
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

