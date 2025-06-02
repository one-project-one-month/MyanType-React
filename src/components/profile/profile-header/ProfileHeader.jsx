import {Edit} from "lucide-react";
import useResult from "../../../../hooks/useResult.jsx";
import dayjs from "dayjs";

export default function ProfileHeader() {
    const { data } = useResult();

    const username = data?.user?.username;
    const joinDateRaw = data?.user?.createdAt;
    const joinDate = dayjs(joinDateRaw).format('MMM D, YYYY');
    return (
        <div className={'flex flex-col gap-2 text-white tracking-wider items-center sm:items-start text-center sm:text-left'}>
            <img
                src={'https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg'}
                className={'w-16 h-16 rounded-3xl object-cover'}
            />
            <div className={'flex flex-col'}>
                <h1 className={'text-2xl'}>{username}</h1>
                <p className={'text-sm font-light text-[#777C90]'}>Joined {joinDate}</p>
            </div>
        </div>
    );
}