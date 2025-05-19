export default function TypingStatsPanel({ stats }) {
    return (
        <div className={'flex gap-12'}>
            {stats.map((stat, i) => (
                <div key={i} className={`flex flex-col gap-2 ${stat.label === 'Time typing' ? 'block text-right' : ''}`}>
                    <p>{stat.label}</p>
                    <h1 className={'text-3xl'}>{stat.value}</h1>
                </div>
            ))}
        </div>
    );
}