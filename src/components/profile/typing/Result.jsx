export default function Result({ results }) {
    return (
        <div className={'flex gap-12'}>
            {results.map((item, i) => {
                if (item.label === 'Tests completed') {
                    return (
                        <div key={i} className="flex flex-col gap-2">
                            <p className="text-sm font-normal opacity-70">{item.label}</p>
                            <h1 className="text-3xl font-semibold">{item.value}</h1>
                        </div>
                    );
                } else {
                    return (
                        <div key={i} className="flex flex-col">
                            <p className="text-sm font-normal opacity-70">{item.time} seconds</p>
                            <h1 className="text-3xl font-semibold">{item.wpm} WPM</h1>
                            <p className="text-xl opacity-70">{item.accuracy}%</p>
                        </div>
                    );
                }
            })}
        </div>
    );
}