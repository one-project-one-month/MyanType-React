import Table from "@/components/Table.jsx";
import {useState} from "react";
import {leaderboards} from "@/data.js";
import {createColumnHelper} from "@tanstack/react-table";
import {Crown, Globe} from "lucide-react";

export default function LeaderboardTable() {
    const [data] = useState([...leaderboards]);

    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor('rank', {
            cell: info => {
                const rank = info.row.index + 1;
                let crownColor = '';
                if (rank === 1) crownColor = 'text-yellow-400';
                else if (rank === 2) crownColor = 'text-gray-300';
                else if (rank === 3) crownColor = 'text-amber-600';

                return (
                    <span className={'block flex justify-center text-center'}>
                        {
                            rank <= 3 ? (
                                <Crown className={`h-5 w-5 ${crownColor}`} />
                            ) : (
                                rank
                            )
                        }
                    </span>
                )
            },
            header: 'RANK'
        }),
        {
            id: 'name',
            header: 'NAME',
            cell: info => {
                const { profile, name } = info.row.original;
                return (
                    <div className={'flex items-center gap-1.5 block text-left w-3xs font-light'}>
                        <img
                            src={profile}
                            alt={name}
                            className={'w-5 h-5 border-1 border-zinc-600 rounded-full object-cover'}
                        />
                        <span>{name}</span>
                    </div>
                );
            }
        },
        /*columnHelper.accessor('name', {
            cell: info => <span className={'block text-left w-3xs font-light'}>{info.getValue()}</span>,
            header: 'NAME'
        }),*/
        columnHelper.accessor('wpm', {
            cell: info => <span>{info.getValue()}</span>,
            header: 'WPM'
        }),
        columnHelper.accessor('accuracy', {
            cell: info => <span>{info.getValue()}</span>,
            header: 'ACCURACY',
        }),
        columnHelper.accessor('raw', {
            cell: info => <span>{info.getValue()}</span>,
            header: 'RAW',
        }),
        columnHelper.accessor('consistency', {
            cell: info => <span>{info.getValue()}</span>,
            header: 'CONSISTENCY',
        }),
        columnHelper.accessor('date', {
            cell: info => <span>{info.getValue()}</span>,
            header: 'DATE',
        }),
    ];

    return (
        <div className={'text-white max-w-5xl mx-auto'}>
            <Table columns={columns} data={data} />
        </div>
    );
}