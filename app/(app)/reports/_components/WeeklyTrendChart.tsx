"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Label, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, ComposedChart } from "recharts";

const WeeklyTrendChart = ({ weeklyData }) => {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleLegendClick = (entry) => {
    setSelectedMood(selectedMood === entry.dataKey ? null : entry.dataKey);
  };

  const getBarOpacity = (dataKey) => {
    if (!selectedMood) return 1;
    return dataKey === selectedMood ? 1 : 0.3;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Weekly Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={weeklyData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis>
              <Label
                value="Number of responses"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: 'middle' }}
              />
            </YAxis>
            <Tooltip
              formatter={(value) => {
                return typeof value === 'string'
                  ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
                  : value;
              }}
            />
            <Legend
              onClick={handleLegendClick}
              formatter={(value) => value.charAt(0) + value.slice(1).toLowerCase()}
            />
            <Bar
              dataKey="HAPPY"
              fill="#4CAF50"
              name="Happy"
              radius={[4, 4, 0, 0]}
              opacity={getBarOpacity('HAPPY')}
            />
            <Bar
              dataKey="OKAY"
              fill="#FFC107"
              name="Okay"
              radius={[4, 4, 0, 0]}
              opacity={getBarOpacity('OKAY')}
            />
            <Bar
              dataKey="UNHAPPY"
              fill="#F44336"
              name="Unhappy"
              radius={[4, 4, 0, 0]}
              opacity={getBarOpacity('UNHAPPY')}
            />
            {selectedMood && (
              <Line
                type="monotone"
                dataKey={selectedMood}
                stroke={
                  selectedMood === 'HAPPY' ? '#4CAF50' :
                    selectedMood === 'OKAY' ? '#FFC107' : '#F44336'
                }
                strokeWidth={2}
                dot={{ fill: 'white', strokeWidth: 2 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
        <div className='text-center'>
          <span className='font-bold text-sm italic'>Click on legend to filter</span>
        </div>

      </CardContent>

    </Card>
  );
};

export default WeeklyTrendChart;