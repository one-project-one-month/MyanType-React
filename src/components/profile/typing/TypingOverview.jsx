import {typingSpeeds, typingStats} from "@/data.js";
import TypingResults from "@/components/common/TypingResults.jsx";
import TypingStatsPanel from "@/components/profile/typing/TypingStatsPanel.jsx";
import TypingSpeedPanel from "@/components/profile/typing/TypingSpeedPanel.jsx";

export default function TypingResultsContainer() {
    return (
        <div className={'flex flex-col mb-4 gap-4 sm:flex-row sm:gap-3'}>
            <TypingResults className={'gap-12'}>
                <TypingStatsPanel stats={typingStats} />
            </TypingResults>
            <TypingResults className={'gap-12'}>
                <TypingSpeedPanel speeds={typingSpeeds} />
            </TypingResults>
        </div>
    );
}