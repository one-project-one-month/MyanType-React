import {Loader2} from "lucide-react";
import Table from "@/components/common/Table.jsx";
import ProfileHeader from "@/components/profile/profile-header/ProfileHeader.jsx";
import TypingOverview from "@/components/profile/typing/TypingOverview.jsx";
import useHistory from "../../hooks/useHistory.jsx";

export default function Profile() {
    const { table, isLoading, isError } = useHistory();

    return (
        <div className={'text-white mx-auto p-4 md:px-16 md:pt-10'}>
            <div className={'flex flex-col gap-6 sm:flex-row sm:justify-between'}>
                <ProfileHeader />
                <TypingOverview />
            </div>
            {isLoading ? (
                <Loader2 className="mx-auto h-14 w-14 my-16 animate-spin text-slate-500" />
            ) : /*isError ? (
                <p className={'text-lg text-red-500 py-6'}>Failed to load data. Please try again.</p>
            ) :*/ (
                <div>
                    <Table table={table} />
                </div>
            )}
        </div>
    );
}