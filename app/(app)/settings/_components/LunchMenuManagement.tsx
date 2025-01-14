import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const LunchMenuManagement = () => {
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState<{
    week: string;
    range: string;
    dates: string[];
  } | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<Record<string, string>>({});



  // Sample data structure for the dates
  const weekDates = {
    '1': [
      ['16/09/2024', '17/09/2024', '18/09/2024', '19/09/2024', '20/09/2024'],
      ['07/10/2024', '08/10/2024', '09/10/2024', '10/10/2024', '11/10/2024'],
      ['04/11/2024', '05/11/2024', '06/11/2024', '07/11/2024', '08/11/2024'],
      ['25/11/2024', '26/11/2024', '27/11/2024', '28/11/2024', '29/11/2024'],
      ['16/12/2024', '17/12/2024', '18/12/2024', '19/12/2024', '20/12/2024'],
    ],
    '2': [
      ['23/09/2024', '24/09/2024', '25/09/2024', '26/09/2024', '27/09/2024'],
      ['14/10/2024', '15/10/2024', '16/10/2024', '17/10/2024', '18/10/2024'],
      ['11/11/2024', '12/11/2024', '13/11/2024', '14/11/2024', '15/11/2024'],
      ['02/12/2024', '03/12/2024', '04/12/2024', '05/12/2024', '06/12/2024'],
    ],
    '3': [
      ['30/09/2024', '01/10/2024', '02/10/2024', '03/10/2024', '04/10/2024'],
      ['21/10/2024', '22/10/2024', '23/10/2024', '24/10/2024', '25/10/2024'],
      ['18/11/2024', '19/11/2024', '20/11/2024', '21/11/2024', '22/11/2024'],
      ['09/12/2024', '10/12/2024', '11/12/2024', '12/12/2024', '13/12/2024'],
    ]
  };


  const formatDateRange = (dates: string[]) => {
    return `${dates[0]} - ${dates[4]}`;
  };

  // Function to handle week selection
  const handleDateRangeSelection = (value: string) => {
    const [week, index] = value.split('-');
    const selectedDates = weekDates[week][parseInt(index)];

    setSelectedDateRange({
      week,
      range: formatDateRange(selectedDates),
      dates: selectedDates
    });
  };

  const foodOptions = [
    {
      id: '1',
      description: 'Pizza Extravaganza',
      shortLabel: 'Pizza',
      type: 'Main',
      dietary: 'V / Ve'
    },
    {
      id: '2',
      description: 'Freshly Cut Fruit (Ve) or Organic Fruit Yoghurt (V)',
      shortLabel: 'Fruit/Yog',
      type: 'Dessert',
      dietary: 'V / Ve'
    },
    {
      id: '3',
      description: 'Green Pesto Chicken Pasta served with Home Made Garlic Focaccia Bread and Carrots',
      shortLabel: 'Pesto Chicken',
      type: 'Main',
      dietary: ''
    },
    {
      id: '4',
      description: 'Red Pepper Pesto Wholemeal Pasta served with Home Made Garlic Focaccia Bread and Carrots (Ve)',
      shortLabel: 'Pesto Pasta',
      type: 'Main',
      dietary: 'Ve'
    },
    {
      id: '5',
      description: 'Freshly Cut Fruit (Ve) or Organic Fruit Yoghurt (V) or Cherry Swirl Sponge (V)',
      shortLabel: 'Fruit/Yog/Cake',
      type: 'Dessert',
      dietary: 'V'
    },
    {
      id: '6',
      description: 'Quorn Sausage served with Creamy Vegan Mash and Smokey Baked Beans (Ve)',
      shortLabel: 'Sausage&MashVe',
      type: 'Main',
      dietary: 'Ve'
    },
    {
      id: '7',
      description: 'Toulouse Sausage served with Cheesy Mash and Smokey Baked Beans',
      shortLabel: 'Sausage&Mash',
      type: 'Main',
      dietary: ''
    },
    {
      id: '8',
      description: 'BBQ Chicken served with Mac & Cheese and a Mixed Salad',
      shortLabel: 'Chicken&Mac&Che',
      type: 'Main',
      dietary: ''
    },
    {
      id: '9',
      description: 'Tempura Vegetables and Soba Noodles (Ve)',
      shortLabel: 'Veg&Noodles',
      type: 'Main',
      dietary: 'Ve'
    },
    {
      id: '10',
      description: 'Freshly Cut Fruit (Ve) or Organic Fruit Yoghurt (V) or Biscoff Sponge (V)',
      shortLabel: 'Fruit/Yog/Cake',
      type: 'Dessert',
      dietary: 'V/Ve'
    },
    {
      id: '11',
      description: 'Omega 3 Fish Fingers served with Chips and Garden Peas',
      shortLabel: 'Fish&Chips',
      type: 'Main',
      dietary: ''
    },
    {
      id: '12',
      description: 'Crunchy Vegetable Fingers served with Chips and Garden Peas (Ve)',
      shortLabel: 'Veg&Chips',
      type: 'Main',
      dietary: 'Ve'
    },
  ];

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const mealTypes = ['Option 1', 'Option 2', 'Dessert'];

  // Function to get placeholder text based on meal type
  const getPlaceholder = (type: string) => {
    return type === 'Dessert' ? 'Select Dessert' : 'Select Meal';
  };

  // Function to filter food options based on meal type
  const getFilteredOptions = (type: string) => {
    return foodOptions.filter(option => {
      if (type === 'Dessert') {
        return option.type === 'Dessert';
      }
      return option.type === 'Main';
    });
  };

  const handleMealSelection = (type: string, day: string, value: string) => {
    setSelectedMeals(prev => ({
      ...prev,
      [`${type}-${day}`]: value
    }));
  };

  const getSelectedMealShortLabel = (type: string, day: string) => {
    const selectedId = selectedMeals[`${type}-${day}`];
    return foodOptions.find(option => option.id === selectedId)?.shortLabel || '';
  };

  const getSelectedMealDescription = (type: string, day: string): string => {
    const selectedId = selectedMeals[`${type}-${day}`];
    return foodOptions.find(option => option.id === selectedId)?.description || '';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lunch Menu Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">

          {/* Controls Section */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px] max-w-xs">
              <Select
                value={selectedDateRange ? `${selectedDateRange.week}-${weekDates[selectedDateRange.week].findIndex(dates => dates[0] === selectedDateRange.dates[0])}` : ''}
                onValueChange={handleDateRangeSelection}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select dates">
                    {selectedDateRange?.range}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border-gray-200">
                  {Object.entries(weekDates).map(([weekNum, dateRanges]) => (
                    <div key={weekNum} className="pb-2">
                      <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 bg-gray-50">
                        Week {weekNum}
                      </div>
                      {dateRanges.map((dateRange, index) => (
                        <SelectItem
                          key={`${weekNum}-${index}`}
                          value={`${weekNum}-${index}`}
                        >
                          {formatDateRange(dateRange)}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px] max-w-xs">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select school" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border-gray-200 min-w-[280px]">
                  <SelectItem value="all">All Schools</SelectItem>
                  <SelectItem value="school1">School 1</SelectItem>
                  <SelectItem value="school2">School 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Menu Table */}
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="font-medium w-24 min-w-[96px]">Type</TableCell>
                  {weekdays.map((day) => (
                    <TableCell key={day} className="font-medium w-48 min-w-[192px]">
                      {day}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mealTypes.map((type) => (
                  <TableRow key={type}>
                    <TableCell className="font-medium w-24 min-w-[96px]">{type}</TableCell>
                    {weekdays.map((day) => (
                      <TableCell
                        key={`${type}-${day}`}
                        className="w-48 min-w-[192px] p-2"
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-full">
                                <Select
                                  value={selectedMeals[`${type}-${day}`]}
                                  onValueChange={(value) => handleMealSelection(type, day, value)}
                                >
                                  <SelectTrigger className="w-full h-10 px-3">
                                    <div className="flex w-full items-center">
                                      <span className="block truncate">
                                        {selectedMeals[`${type}-${day}`]
                                          ? getSelectedMealShortLabel(type, day)
                                          : getPlaceholder(type)
                                        }
                                      </span>
                                    </div>
                                  </SelectTrigger>
                                  <SelectContent
                                    className="bg-white shadow-lg border-gray-200 w-[400px]"
                                    position="popper"
                                    align="start"
                                  >
                                    {getFilteredOptions(type).map((option) => (
                                      <SelectItem
                                        key={option.id}
                                        value={option.id}
                                        className="flex flex-col items-start gap-1 py-3"
                                      >
                                        {/* <span className="font-medium">{option.shortLabel}</span> */}
                                        <span className="text-sm text-gray-500 break-normal">
                                          {option.description}
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-white shadow-lg border-gray-200 max-w-[300px]">
                              {getSelectedMealDescription(type, day) || getPlaceholder(type)}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Options Section */}
          <div className="pt-4">
            <Button variant="secondary">Manage Options</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LunchMenuManagement;