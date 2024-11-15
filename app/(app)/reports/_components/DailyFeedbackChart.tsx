import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

const DailyFeedbackChart = ({ dailyData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dailyData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {dailyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.name === 'HAPPY' ? '#4CAF50' :
                      entry.name === 'OKAY' ? '#FFC107' :
                        entry.name === 'UNHAPPY' ? '#F44336' :
                          COLORS[index % COLORS.length]
                  }
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} votes`, name]}
              labelFormatter={() => ''}
            />
            <Legend
              formatter={(value, entry) => {
                const { payload } = entry;
                return `${value}: ${payload!.value} `;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DailyFeedbackChart;