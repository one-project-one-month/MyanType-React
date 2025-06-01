import { typingOverview } from "@/data.js";
import TypingResults from "@/components/common/TypingResults.jsx";
import Result from "@/components/profile/typing/Result.jsx";
import useResult from "../../../../hooks/useResult.jsx";

export default function TypingOverview() {
    const { data } = useResult();

    const stats = data;

    const typingOverview = [
        {
            label: 'Tests completed',
            value: stats?.testsCompleted || 0,
        },
        {
            time: 15,
            wpm: stats?.highest15sWpm || 0,
            accuracy: stats?.accuracy15s || 0,
        },
        {
            time: 60,
            wpm: stats?.highest60sWpm || 0,
            accuracy: stats?.accuracy60s || 0,
        },
    ];

    return (
        <div className={'flex flex-col mb-4 gap-4 sm:flex-row sm:gap-3'}>
            <TypingResults className={'gap-12'}>
                <Result results={typingOverview} />
            </TypingResults>

        </div>
    );
}