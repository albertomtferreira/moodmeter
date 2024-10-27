"use client";
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Loader2, CalendarIcon } from 'lucide-react';
import { DatePickerWithPresets } from '@/components/DatePickerWithPresets';
import { format } from 'date-fns';

const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

interface School {
  id: string;
  name: string;
  color: string;
}

interface ChartData {
  name: string;
  value?: number;
  Satisfaction?: number;
  HAPPY?: number;
  OKAY?: number;
  UNHAPPY?: number;
}

const ReportsPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dailyData, setDailyData] = useState<ChartData[]>([]);
  const [weeklyData, setWeeklyData] = useState<ChartData[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
  const [comparisonData, setComparisonData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch schools (unchanged)
  useEffect(() => {
    fetch('/api/schools')
      .then(res => res.json())
      .then(data => {
        setSchools(data);
        if (data.length > 0) {
          setSelectedSchool(data[0].id);
        }
      });
  }, []);

  // Fetch school comparison data (unchanged)
  useEffect(() => {
    fetch('/api/reports/comparison')
      .then(res => res.json())
      .then(data => setComparisonData(data))
      .catch(error => console.error('Error fetching comparison data:', error));
  }, []);

  // Modified fetch report data to include date for daily data
  useEffect(() => {
    if (!selectedSchool) return;

    setLoading(true);

    Promise.all([
      fetch(`/api/reports/daily?schoolId=${selectedSchool}&date=${format(selectedDate, 'yyyy-MM-dd')}`),
      fetch(`/api/reports/weekly?schoolId=${selectedSchool}`),
      fetch(`/api/reports/monthly?schoolId=${selectedSchool}`)
    ])
      .then(([dailyRes, weeklyRes, monthlyRes]) =>
        Promise.all([
          dailyRes.json(),
          weeklyRes.json(),
          monthlyRes.json()
        ])
      )
      .then(([daily, weekly, monthly]) => {
        setDailyData(daily);
        setWeeklyData(weekly);
        setMonthlyData(monthly);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching report data:', error);
        setLoading(false);
      });
  }, [selectedSchool, selectedDate]); // Added selectedDate dependency

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <Select value={selectedSchool} onValueChange={setSelectedSchool}>
        <SelectTrigger className="w-[280px] mb-4 bg-white border-gray-200 shadow-sm">
          <SelectValue placeholder="Select School" />
        </SelectTrigger>
        <SelectContent className="bg-white shadow-lg border-gray-200 min-w-[280px]">
          {schools.map(school => (
            <SelectItem
              key={school.id}
              value={school.id}
              className="hover:bg-gray-100 cursor-pointer"
            >
              {school.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Daily Feedback</CardTitle>
            <DatePickerWithPresets
              date={selectedDate}
              setDate={setSelectedDate}
            />
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

        <Card>
          <CardHeader>
            <CardTitle>Weekly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="HAPPY" fill="#4CAF50" />
                <Bar dataKey="OKAY" fill="#FFC107" />
                <Bar dataKey="UNHAPPY" fill="#F44336" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Monthly Satisfaction Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Satisfaction" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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
                  <Cell key={`cell-${index}`} fill={schools[index]?.color || COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;