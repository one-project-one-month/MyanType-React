import useHistory from "../../../hooks/useHistory.jsx";
import Table from "@/components/common/Table.jsx";
import TypingResultsContainer from "@/components/profile/typing/TypingResultsContainer.jsx";
import ProfileHeader from "@/components/profile/profile-header/ProfileHeader.jsx";

export default function Profile() {
    const table = useHistory();

    return (
        <div className={'text-white mx-auto'}>
            <div className={'flex flex-col gap-6 sm:flex-row sm:justify-between'}>
                <ProfileHeader />
                <TypingResultsContainer />
            </div>
            <Table table={table} />
        </div>
    );
}