"use client";
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#4CAF50', '#FFC107', '#F44336'];
const SCHOOLS = ['School A', 'School B', 'School C', 'School D'];

// Mock data generators
const generateDailyData = () => {
  return ['Happy', 'Okay', 'Unhappy'].map(emotion => ({
    name: emotion,
    value: Math.floor(Math.random() * 100)
  }));
};

const generateWeeklyData = () => {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => ({
    name: day,
    Happy: Math.floor(Math.random() * 100),
    Okay: Math.floor(Math.random() * 100),
    Unhappy: Math.floor(Math.random() * 100)
  }));
};

const generateMonthlyData = () => {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
    name: month,
    Satisfaction: Math.floor(Math.random() * 100)
  }));
};

const generateSchoolComparisonData = () => {
  return SCHOOLS.map(school => ({
    name: school,
    Satisfaction: Math.floor(Math.random() * 100)
  }));
};

const ReportsPage: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState(SCHOOLS[0]);
  const dailyData = generateDailyData();
  const weeklyData = generateWeeklyData();
  const monthlyData = generateMonthlyData();
  const schoolComparisonData = generateSchoolComparisonData();

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <Select value={selectedSchool} onValueChange={setSelectedSchool}>
        <SelectTrigger className="w-[180px] mb-4">
          <SelectValue placeholder="Select School" />
        </SelectTrigger>
        <SelectContent>
          {SCHOOLS.map(school => (
            <SelectItem key={school} value={school}>{school}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dailyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
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
                <Bar dataKey="Happy" fill="#4CAF50" />
                <Bar dataKey="Okay" fill="#FFC107" />
                <Bar dataKey="Unhappy" fill="#F44336" />
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
              <YAxis />
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
            <BarChart data={schoolComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Satisfaction" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;