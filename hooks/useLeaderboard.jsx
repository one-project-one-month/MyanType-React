import {createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";
import {Crown} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import axios from "@/lib/axios.js";

const columnHelper = createColumnHelper();
const columns = [
    columnHelper.display({
        id: 'rank',
        cell: info => {
            const rank = info.row.index + 1;
            const crownColor =
                rank === 1 ? 'text-yellow-400' :
                    rank === 2 ? 'text-gray-300' :
                        rank === 3 ? 'text-amber-500' : '';

            return (
                <span className={'flex justify-center'}>
                    {rank <= 3 ? <Crown className={`h-5 w-5 ${crownColor}`} /> : rank}
                </span>
            );
        },
        header: 'Rank'
    }),
    {
        id: 'name',
        header: 'NAME',
        cell: info => {
            const { user } = info.row.original;
            const { username } = user || {};
            return (
                <div className="flex items-center gap-1.5 text-left font-light">
                    <img src={'https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg'} alt={username} className="w-5 h-5 rounded-full border border-zinc-600 object-cover" />
                    <span>{username}</span>
                </div>
            );
        }
    },
    columnHelper.accessor('wpm', { header: 'WPM' }),
    columnHelper.accessor('accuracy', { header: 'ACCURACY', cell: info => `${info.getValue()}%` }),
    columnHelper.accessor('raw', { header: 'RAW', cell: info => `${info.getValue()}%` }),
    columnHelper.accessor('consistency', { header: 'CONSISTENCY' }),
    columnHelper.accessor('createdAt', {
        header: 'DATE',
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
            console.log('Leaderboard API raw data:', res.data.data)
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