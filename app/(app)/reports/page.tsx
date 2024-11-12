"use client";
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { DatePickerWithPresets } from '@/components/DatePickerWithPresets';
import { WeekPickerWithPresets } from '@/components/WeekPickerWithPresets';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { useAppStore } from '@/store/useAppStore';
import { endOfMonth, format, startOfMonth } from 'date-fns';

import { TermPickerWithPresets } from '@/components/TermPickerWithPresets';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

interface DateRange {
  from: Date;
  to: Date;
}

const ReportsPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [dailyData, setDailyData] = useState<ChartData[]>([]);
  const [weeklyData, setWeeklyData] = useState<ChartData[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
  const [comparisonData, setComparisonData] = useState<ChartData[]>([]);
  const [monthlyRange, setMonthlyRange] = useState<DateRange>({
    from: startOfMonth(new Date(new Date().getFullYear(), 0, 1)), // Start of current year
    to: endOfMonth(new Date()) // End of current month
  });

  const { setLoading } = useAppStore();

  // Fetch schools
  useEffect(() => {
    const fetchSchools = async () => {
      setLoading({
        isLoading: true,
        message: 'Loading schools...',
        type: 'content'
      });

      try {
        const response = await fetch('/api/schools');
        const data = await response.json();
        setSchools(data);
        if (data.length > 0) {
          setSelectedSchool(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
      } finally {
        setLoading({
          isLoading: false
        });
      }
    };

    fetchSchools();
  }, []);

  // Fetch school comparison data
  useEffect(() => {
    const fetchComparisonData = async () => {
      setLoading({
        isLoading: true,
        message: 'Loading comparison data...',
        type: 'content'
      });

      try {
        const response = await fetch('/api/reports/comparison');
        const data = await response.json();
        setComparisonData(data);
      } catch (error) {
        console.error('Error fetching comparison data:', error);
      } finally {
        setLoading({
          isLoading: false
        });
      }
    };

    fetchComparisonData();
  }, []);

  // Fetch report data
  useEffect(() => {
    if (!selectedSchool) return;

    const fetchReportData = async () => {
      setLoading({
        isLoading: true,
        message: 'Loading report data...',
        type: 'content'
      });

      try {
        const [dailyRes, weeklyRes, monthlyRes] = await Promise.all([
          fetch(`/api/reports/daily?schoolId=${selectedSchool}&date=${format(selectedDate, 'yyyy-MM-dd')}`),
          fetch(`/api/reports/weekly?schoolId=${selectedSchool}&week=${format(selectedWeek, 'yyyy-MM-dd')}`),
          fetch(`/api/reports/monthly?schoolId=${selectedSchool}&from=${format(monthlyRange.from, 'yyyy-MM-dd')}&to=${format(monthlyRange.to, 'yyyy-MM-dd')}`)
        ]);

        const [daily, weekly, monthly] = await Promise.all([
          dailyRes.json(),
          weeklyRes.json(),
          monthlyRes.json()
        ]);

        setDailyData(daily);
        setWeeklyData(weekly);
        setMonthlyData(monthly);
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading({
          isLoading: false
        });
      }
    };

    fetchReportData();
  }, [selectedSchool, selectedDate, selectedWeek]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <SignedIn>


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
          {/* DAILY CHART section of the ReportsPage */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Daily Feedback</CardTitle>
              <DatePickerWithPresets date={selectedDate} setDate={setSelectedDate} />
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

          {/* Weekly Chart section of the ReportsPage */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Weekly Trend</CardTitle>
              <WeekPickerWithPresets date={selectedWeek} setDate={setSelectedWeek} />
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
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
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* MONTHLY CHART */}


        <Card className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Monthly Satisfaction Rate </CardTitle>
            <TermPickerWithPresets
              range={monthlyRange}
              setRange={setMonthlyRange}
            />
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
      </SignedIn>
      <LoadingOverlay />
      <SignedOut>
        <Link href="/sign-in">
          <Button
            variant="ghost"
            className="justify-center w-full"
          >
            <LogIn className="mr-2" /> Login
          </Button>
        </Link>
      </SignedOut>

    </div>
  );
};

export default ReportsPage;