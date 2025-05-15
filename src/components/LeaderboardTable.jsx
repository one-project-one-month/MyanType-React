import Table from "@/components/Table.jsx";
import {useState} from "react";
import {leaderboards} from "@/data.js";
import {createColumnHelper} from "@tanstack/react-table";

export default function LeaderboardTable() {
    const [data] = useState([...leaderboards]);

    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor('rank', {
            cell: info => <span className={'block text-center'}>{info.row.index + 1}</span>,
            header: 'RANK'
        }),
        columnHelper.accessor('name', {
            cell: info => <span className={'block text-left text-base font-light'}>{info.getValue()}</span>,
            header: 'NAME'
        }),
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
    )
}