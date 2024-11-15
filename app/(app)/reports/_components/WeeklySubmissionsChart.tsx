import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeekPickerWithPresets } from "@/components/WeekPickerWithPresets";
import { Bar, BarChart, CartesianGrid, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const WeeklySubmissionsChart = ({ data }) => {
  // Calculate total submissions for each day
  const submissionsData = data.map(day => ({
    name: day.name,
    Submissions: day.HAPPY + day.OKAY + day.UNHAPPY
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Daily Submissions</CardTitle>

      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={submissionsData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis>
              <Label
                value="Total submissions"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: 'middle' }}
              />
            </YAxis>
            <Tooltip />
            <Legend />
            <Bar
              dataKey="Submissions"
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
              label={{
                position: 'top',
                formatter: (value) => value
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WeeklySubmissionsChart