import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ResultsChart = ({ intervals }) => {
  if (!intervals || intervals.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 bg-[#0E0F15] border border-white">
        <p>No interval data available</p>
      </div>
    );
  }

  const chartData = intervals.map(interval => ({
    time: `${interval.timestamp}s`,
    wpm: interval.wpm,
    accuracy: interval.accuracy,
  }));

  return (
    <div className="h-64 bg-[#0E0F15] ">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="wpm"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            name="WPM"
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            name="Accuracy %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultsChart;