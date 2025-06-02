export function formatHHMMSS(totalSeconds) {
    const hr = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const min = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const sec = String(Math.floor(totalSeconds % 60)).padStart(2, '0');
    return `${hr} : ${min} : ${sec}`;
}

export function getSecondUntilMidnight() {
    const now = new Date();
    return 86400 - (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds());
}