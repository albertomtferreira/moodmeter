import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COLORS } from "@/data/constants";
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const SchoolComparisonChart = ({ comparisonData, schools }) => (
  <Card>
    <CardHeader>
      <CardTitle>School Comparison</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={comparisonData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Satisfaction" fill="#8884d8">
            {comparisonData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={schools[index]?.color || COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default SchoolComparisonChart