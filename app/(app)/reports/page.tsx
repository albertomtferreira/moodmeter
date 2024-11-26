"use client";
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { DatePickerWithPresets } from '@/components/DatePickerWithPresets';
import { WeekPickerWithPresets } from '@/components/WeekPickerWithPresets';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { useAppStore } from '@/store/useAppStore';
import { endOfMonth, format, startOfMonth } from 'date-fns';

import { TermPickerWithPresets } from '@/components/TermPickerWithPresets';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { LogIn, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DailyFeedbackChart from './_components/DailyFeedbackChart';
import WeeklySubmissionsChart from './_components/WeeklySubmissionsChart';
import DailyTimeAnalysis from './_components/DailyTimeAnalysis';
import WeeklyTrendChart from './_components/WeeklyTrendChart';
import MonthlySatisfactionChart from './_components/MonthlySatisfactionChart';
import DailyTrendByTime from './_components/DailyTrendByTime';
// import SchoolComparisonChart from './_components/SchoolComparisonChart';


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

interface UserSchool {
  school: School;
  isPreferred: boolean;
}

const SectionHeader = ({ title, children }: { title: string; children?: React.ReactNode }) => (
  <div className="flex justify-between items-center mb-4 m-4">
    <h2 className="text-3xl underline font-semibold">{title}</h2>
    {children}
  </div>
);

const ReportsPage: React.FC = () => {
  // const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [dailyData, setDailyData] = useState<ChartData[]>([]);
  const [weeklyData, setWeeklyData] = useState<ChartData[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
  // const [comparisonData, setComparisonData] = useState<ChartData[]>([]);
  const [dailyTimeData, setDailyTimeData] = useState([]);
  const [monthlyRange, setMonthlyRange] = useState<DateRange>({
    from: startOfMonth(new Date(new Date().getFullYear(), 0, 1)), // Start of current year
    to: endOfMonth(new Date()) // End of current month
  });
  const [userSchools, setUserSchools] = React.useState<UserSchool[]>([]);
  const { loading, setLoading } = useAppStore();

  // Fetch schools
  // useEffect(() => {
  //   const fetchSchools = async () => {
  //     setLoading({
  //       isLoading: true,
  //       message: 'Loading schools...',
  //       type: 'content'
  //     });

  //     try {
  //       const response = await fetch('/api/schools');
  //       const data = await response.json();
  //       setSchools(data);
  //       console.log("Fetched schools data-------", data[0].id);
  //       if (data.length > 0) {
  //         setSelectedSchool(data[0].id);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching schools:', error);
  //     } finally {
  //       setLoading({
  //         isLoading: false
  //       });
  //     }
  //   };

  //   fetchSchools();
  // }, []);


  useEffect(() => {
    const fetchUserSchools = async () => {

      setLoading({
        isLoading: true,
        message: 'Fetching Schools...',
        type: 'content'
      });
      try {
        // Add authentication header
        const response = await fetch('/api/users/schools', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch your schools!');
        }

        const data = await response.json();
        setUserSchools(data);

        const preferredSchool = data.find(school => school.isPreferred === true);
        if (preferredSchool) {
          const schoolId = preferredSchool.school.id;
          setSelectedSchool(schoolId);
        }
      } catch (err) {
        console.error('Error fetching user schools:', err);
        // setError(err instanceof Error ? err.message : 'Failed to load your schools');
      } finally {
        setLoading({
          isLoading: false
        });
      }
    };
    fetchUserSchools()
  }, []);

  // Fetch school comparison data
  // useEffect(() => {
  //   const fetchComparisonData = async () => {
  //     setLoading({
  //       isLoading: true,
  //       message: 'Loading comparison data...',
  //       type: 'content'
  //     });

  //     try {
  //       const response = await fetch('/api/reports/comparison');
  //       const data = await response.json();
  //       setComparisonData(data);
  //     } catch (error) {
  //       console.error('Error fetching comparison data:', error);
  //     } finally {
  //       setLoading({
  //         isLoading: false
  //       });
  //     }
  //   };

  //   fetchComparisonData();
  // }, []);

  // Fetch report data

  // useEffect(() => {
  //   if (!selectedSchool) return;

  //   const fetchReportData = async () => {
  //     setLoading({
  //       isLoading: true,
  //       message: 'Loading report data...',
  //       type: 'content'
  //     });

  //     try {
  //       const [dailyRes, weeklyRes, monthlyRes] = await Promise.all([
  //         fetch(`/api/reports/daily?schoolId=${selectedSchool}&date=${format(selectedDate, 'yyyy-MM-dd')}`),
  //         fetch(`/api/reports/weekly?schoolId=${selectedSchool}&week=${format(selectedWeek, 'yyyy-MM-dd')}`),
  //         fetch(`/api/reports/monthly?schoolId=${selectedSchool}&from=${format(monthlyRange.from, 'yyyy-MM-dd')}&to=${format(monthlyRange.to, 'yyyy-MM-dd')}`)
  //       ]);

  //       const [daily, weekly, monthly] = await Promise.all([
  //         dailyRes.json(),
  //         weeklyRes.json(),
  //         monthlyRes.json()
  //       ]);

  //       setDailyData(daily.moods);
  //       setDailyTimeData(daily.timeAnalysis);
  //       setWeeklyData(weekly);
  //       setMonthlyData(monthly);
  //     } catch (error) {
  //       console.error('Error fetching report data:', error);
  //     } finally {
  //       setLoading({
  //         isLoading: false
  //       });
  //     }
  //   };

  //   fetchReportData();
  // }, [selectedSchool, selectedDate, selectedWeek, monthlyRange]);

  const fetchReportData = async () => {
    if (!selectedSchool) return;
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

      setDailyData(daily.moods);
      setDailyTimeData(daily.timeAnalysis);
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

  useEffect(() => {
    fetchReportData();
  }, [selectedSchool, selectedDate, selectedWeek, monthlyRange]);


  return (
    <div className="p-4 max-w-7xl mx-auto space-y-8">
      <SignedIn>

        {/* HEADER */}
        <section>
          <h1 className="text-2xl font-bold mb-6">Reports</h1>
          <div className='flex flex-row gap-4 items-center sm:justify-start justify-between'>
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger className="w-[280px] bg-white border-gray-200 shadow-sm">
                <SelectValue placeholder="Select School" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg border-gray-200 min-w-[280px]">
                {userSchools.map(school => (
                  <SelectItem key={school.school.id} value={school.school.id}>
                    {school.school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className='bg-white border-gray-200 shadow-sm'
              onClick={fetchReportData}
              disabled={loading.isLoading}
            >
              <RefreshCw className={loading.isLoading ? "animate-spin" : ""} />
            </Button>
          </div>
        </section>

        {/* DAILY ANALYSIS */}
        <section>
          <Card className='bg-white' >
            <SectionHeader title="Daily Analysis">
              <DatePickerWithPresets date={selectedDate} setDate={setSelectedDate} />
            </SectionHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-4">
              <DailyFeedbackChart dailyData={dailyData} />
              <DailyTimeAnalysis timeData={dailyTimeData} />


              {/* Daily Trend by time */}
              <DailyTrendByTime timeData={dailyTimeData} />
            </div>
          </Card>
        </section>

        {/* WEEKLY ANALYSIS */}
        <section>
          <Card className='bg-white'>
            <SectionHeader title="Weekly Analysis">
              <WeekPickerWithPresets date={selectedWeek} setDate={setSelectedWeek} />
            </SectionHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-4">
              <WeeklyTrendChart weeklyData={weeklyData} />
              <WeeklySubmissionsChart data={weeklyData} />
            </div>
          </Card>
        </section>

        {/* MONTHLY ANALYSIS */}
        <section>
          <Card className='bg-white'>
            <SectionHeader title="Monthly Analysis">
              <TermPickerWithPresets range={monthlyRange} setRange={setMonthlyRange} />
            </SectionHeader>
            <div className='m-4'>
              <MonthlySatisfactionChart monthlyData={monthlyData} />
            </div>
          </Card>
        </section>

        {/* COMPARISONS */}
        {/* <section>
          <Card className='bg-white'>
            <SectionHeader title="School Comparisons" />
            <div className='m-4'>
              <SchoolComparisonChart comparisonData={comparisonData} schools={userSchools} />
            </div>
          </Card>
        </section> */}

      </SignedIn>

      <LoadingOverlay />

      <SignedOut>
        <Link href="/sign-in">
          <Button variant="ghost" className="justify-center w-full">
            <LogIn className="mr-2" /> Login
          </Button>
        </Link>
      </SignedOut>
    </div>
  );
};

export default ReportsPage;