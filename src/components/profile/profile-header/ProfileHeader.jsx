import {Edit} from "lucide-react";

export default function ProfileHeader({ user }) {
    const { name, joinDate } = user || {};
    return (
        <div className={'flex flex-col gap-2 text-white tracking-wider items-center sm:items-start text-center sm:text-left'}>
            <img
                src={'https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg'}
                className={'w-20 h-20 rounded-3xl object-cover'}
            />
            <div className={'flex flex-col'}>
                <h1 className={'text-2xl'}>{name ?? 'Unknown User'}</h1>
                <div className={' flex items-center gap-1 text-[#777C90]'}>
                    <p className={'text-sm font-light'}>Joined {joinDate}</p>
                    <Edit className={'h-4 w-4'} />
                </div>
            </div>
        </div>
    );
}