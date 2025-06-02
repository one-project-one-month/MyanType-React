import {Timer} from "lucide-react";
import Button from "@/components/common/Button.jsx";

export default function SessionFilter({ mode, setMode, language, setLanguage }) {
    return (
        <div className={'flex flex-col gap-8 w-full'}>
            <div className={'flex justify-between items-center gap-4'}>
                <Button onClick={() => setLanguage('English')} isActive={language === 'English'}>English</Button>
                <Button onClick={() => setLanguage('Myanmar')} isActive={language === 'Myanmar'}>Myanmar</Button>
            </div>

            <div className={'flex justify-between items-center gap-4'}>
                <Button onClick={() => setMode(15)} isActive={mode === 15}>Time 15</Button>
                <Button onClick={() => setMode(60)} isActive={mode === 60}>Time 60</Button>
            </div>
        </div>
    );
}