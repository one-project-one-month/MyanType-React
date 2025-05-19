import {Timer} from "lucide-react";
import Button from "@/components/common/Button.jsx";

export default function SessionFilter({ mode, setMode, language, setLanguage }) {
    return (
        <div className={'flex flex-col gap-3 w-full'}>
            <div className={'grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-1'}>
                <Button onClick={() => setLanguage('English')} isActive={language === 'English'}>English</Button>
                <Button onClick={() => setLanguage('Myanmar')} isActive={language === 'Myanmar'}>Myanmar</Button>
            </div>

            <div className={'h-0.5 bg-[#141723] w-full'}></div>
            <div className={'grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-1'}>
                <Button onClick={() => setMode(15)} isActive={mode === 15}>Time 15</Button>
                <Button onClick={() => setMode(60)} isActive={mode === 60}>Time 60</Button>
            </div>
        </div>
    );
}