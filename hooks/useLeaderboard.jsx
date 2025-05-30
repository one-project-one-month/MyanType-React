import {createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";
import { Trophy } from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import axios from "@/lib/axios.js";

const columnHelper = createColumnHelper();
const columns = [
    columnHelper.display({
        id: 'rank',
        cell: info => {
            const rank = info.row.index + 1;
            const crownColor =
                rank === 1 ? 'text-yellow-500' :
                    rank === 2 ? 'text-gray-300' :
                        rank === 3 ? 'text-amber-600' : '';

            return (
                <span className={'flex justify-center'}>
                    {rank <= 3 ? <Trophy className={`h-4 w-4 ${crownColor}`} /> : rank}
                </span>
            );
        },
        header: 'Rank'
    }),
    {
        id: 'name',
        header: 'Name',
        cell: info => {
            const { user } = info.row.original;
            const { username } = user || {};
            return (
                <div className="flex items-end gap-1.5 text-left font-light">
                    <img src={'https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg'} alt={username} className="w-5 h-5 rounded-full border border-zinc-600 object-cover" />
                    <span>{username}</span>
                </div>
            );
        }
    },
    columnHelper.accessor('wpm', { header: 'Wpm' }),
    columnHelper.accessor('raw', { header: 'Raw' }),
    columnHelper.accessor('accuracy', { header: 'Accuracy', cell: info => `${info.getValue()}%` }),
    columnHelper.accessor('consistency', { header: 'Consistency', cell: info => `${info.getValue()}%` }),
    columnHelper.accessor('createdAt', {
        header: 'Date',
        cell: info => {
            const date = new Date(info.getValue());
            return date.toLocaleString();
        }
    }),
];

export function useLeaderboard(mode, language) {
    const lang = language.toLowerCase() === 'myanmar' ? 'mm' : 'en';

    const { data = [], isLoading, isError } = useQuery({
        queryKey: ['leaderboard', lang, mode],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const res = await axios.get(`/leaderboard/${lang}/${mode}`);
            return res.data.data;
        },
        staleTime: 60 * 1000,
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return {
        table,
        isLoading,
        isError,
    }
}