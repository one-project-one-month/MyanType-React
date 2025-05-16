import Table from "@/components/Table.jsx";
import {useState} from "react";
import {histories} from "@/data.js";
import {createColumnHelper} from "@tanstack/react-table";
import {Globe, Star, Flame} from "lucide-react";

export default function HistoryTable() {
    const iconMap = {
        globe: <Globe className="w-5 h-5" />,
        star: <Star className="w-5 h-5" />,
        flame: <Flame className="w-5 h-5" />,
    }

    const [data] = useState([...histories]);

    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor('', {
            cell: info => <span>{'-'}</span>,
            header: '#',
        }),
        columnHelper.accessor('wpm', {
            cell: info => <span>{info.getValue()}</span>,
            header: 'WPM',
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
        columnHelper.accessor('mode', {
            cell: info => <span>{info.getValue()}s</span>,
            header: 'MODE',
        }),
        columnHelper.accessor('info', {
            cell: info => {
                const iconKey = info.getValue();
                return (
                    <span className={'flex justify-end gap-2'}>
                        {iconMap[iconKey] || null}
                        {iconMap[iconKey] || null}
                    </span>
                )
            },
            header: 'INFO',
        }),
        columnHelper.accessor('date', {
            cell: info => <span>{info.getValue()}</span>,
            header: 'DATE',
        }),
    ];

    return (
        <div className={'text-white mx-auto p-24'}>
            <Table data={data} columns={columns} />
        </div>
    )
}