import {ChevronLeft, ChevronRight, Hash} from "lucide-react";
import {useEffect, useState} from "react";
import {formatHHMMSS, getSecondUntilMidnight} from "../../../utils/format.js";

export default function CountdownWithPagination({ table }) {
    const [second, setSecond] = useState(getSecondUntilMidnight());

    useEffect(() => {
        let interval = setInterval(() => {
            setSecond(prev => prev > 0 ? prev - 1 : getSecondUntilMidnight());
        }, 1000);

        return () => clearInterval(interval);
    }, [])

    return (
        <div className={'flex items-center justify-between mb-4'}>
            <div className={'text-slate-500'}>Next update in: <span>{formatHHMMSS(second)}</span></div>
            <div className={'flex gap-2'}>
                <button
                    className={'text-white bg-[#141723] border border-[#3A3A67]/[0.32] rounded-xl p-3 disabled:opacity-30 cursor-pointer'}
                    onClick={() => {
                        table.previousPage();
                    }}
                    disabled={!table.getCanPreviousPage()}
                >
                    {<ChevronLeft className={'h-3.5 w-3.5'} />}
                </button>
                <button className={'text-white bg-[#141723] border border-[#3A3A67]/[0.32] rounded-xl p-3'}>
                    {<Hash className={'h-3.5 w-3.5'} />}
                </button>
                <button
                    className={'text-white bg-[#141723] border border-[#3A3A67]/[0.32] rounded-xl p-3 disabled:opacity-30 cursor-pointer'}
                    onClick={() => {
                        console.log('Hello')
                        table.nextPage();
                    }}
                    disabled={!table.getCanNextPage()}
                >
                    {<ChevronRight className={'h-3.5 w-3.5'} />}
                </button>
            </div>
        </div>
    )
}