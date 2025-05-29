import { typingOverview } from "@/data.js";
import TypingResults from "@/components/common/TypingResults.jsx";
import Result from "@/components/profile/typing/Result.jsx";

export default function TypingOverview() {
    return (
        <div className={'flex flex-col mb-4 gap-4 sm:flex-row sm:gap-3'}>
            <TypingResults className={'gap-12'}>
                <Result results={typingOverview} />
            </TypingResults>

        </div>
    );
}