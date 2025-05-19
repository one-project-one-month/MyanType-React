import {useMemo} from "react";
import {leaderboards} from "@/data.js";
import {createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";
import {Crown} from "lucide-react";

export function useLeaderboard(mode, language) {
    const filteredData = useMemo(() => {
        return leaderboards
            .filter(row => row.mode === mode && row.language === language)
            .sort((a, b) => parseFloat(b.wpm) - parseFloat(a.wpm));
    }, [mode, language]);

    const columnHelper = createColumnHelper();

    const columns = useMemo(() => [
        columnHelper.display( {
            id: 'rank',
            cell: info => {
                const rank = info.row.index + 1;
                let crownColor = '';
                if (rank === 1) crownColor = 'text-yellow-400';
                else if (rank === 2) crownColor = 'text-gray-300';
                else if (rank === 3) crownColor = 'text-amber-500';

                return (
                    <span className={'flex justify-center'}>
                        {rank <= 3 ? <Crown className={`h-5 w-5 ${crownColor}`} /> : rank}
                    </span>
                );
            },
            header: 'RANK',
        }),
        {
            id: 'name',
            header: 'NAME',
            cell: info => {
                const { profile, name } = info.row.original;

                return (
                    <div className={'flex items-center gap-1.5 text-left font-light'}>
                        <img src={profile} alt={name} className={'w-5 h-5 rounded-full border border-zinc-600 object-cover'} />
                        <span>{name}</span>
                    </div>
                );
            }
        },
        columnHelper.accessor('wpm', { cell: info => <span>{info.getValue()}</span>, header: 'WPM' }),
        columnHelper.accessor('accuracy', { cell: info => <span>{info.getValue()}</span>, header: 'ACCURACY' }),
        columnHelper.accessor('raw', { cell: info => <span>{info.getValue()}</span>, header: 'RAW' }),
        columnHelper.accessor('consistency', { cell: info => <span>{info.getValue()}</span>, header: 'CONSISTENCY' }),
        columnHelper.accessor('date', { cell: info => <span>{info.getValue()}</span>, header: 'DATE' }),
    ], []);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return table;
}