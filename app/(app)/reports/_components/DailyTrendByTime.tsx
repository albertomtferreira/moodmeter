import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, CartesianGrid, ComposedChart, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DailyTrendByTime = ({ timeData }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Daily Feedback by Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={timeData}
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
              formatter={(value) => value.charAt(0) + value.slice(1).toLowerCase()}
            />
            <Bar
              dataKey="HAPPY"
              fill="#4CAF50"
              name="Happy"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="OKAY"
              fill="#FFC107"
              name="Okay"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="UNHAPPY"
              fill="#F44336"
              name="Unhappy"
              radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DailyTrendByTime