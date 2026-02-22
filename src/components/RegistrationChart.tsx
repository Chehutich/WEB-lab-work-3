import { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import { Participant } from '../types';

interface RegistrationChartProps {
    participants: Participant[];
}

const RegistrationChart = ({ participants }: RegistrationChartProps) => {
    const data = useMemo(() => {
        const counts: Record<string, number> = {};

        participants.forEach((p) => {
            const date = p.registrationDate;
            counts[date] = (counts[date] || 0) + 1;
        });

        return Object.entries(counts)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [participants]);

    if (participants.length === 0) return null;

    return (
        <div style={{ width: '100%', height: 300, marginTop: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Активність реєстрацій</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '0.75rem',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorCount)"
                        strokeWidth={3}
                        name="Кількість реєстрацій"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RegistrationChart;
