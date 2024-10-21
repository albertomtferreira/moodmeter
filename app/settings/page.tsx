"use client"
import React, { useState } from 'react';
import { Moon, Sun, Bell, Globe, Eye, Trash, School, BarChart, Key, Info } from 'lucide-react';
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

const SettingItem: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="flex items-center justify-between py-4 border-b">
    <div className="flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </div>
    {children}
  </div>
);

const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('english');
  const [textSize, setTextSize] = useState(16);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-background">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <SettingItem icon={<Moon size={20} />} title="Dark Mode">
        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
      </SettingItem>

      <SettingItem icon={<Bell size={20} />} title="Notifications">
        <Switch checked={notifications} onCheckedChange={setNotifications} />
      </SettingItem>

      <SettingItem icon={<Globe size={20} />} title="Language">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Español</SelectItem>
            <SelectItem value="french">Français</SelectItem>
          </SelectContent>
        </Select>
      </SettingItem>

      <SettingItem icon={<Eye size={20} />} title="Text Size">
        <Slider
          className="w-[180px]"
          value={[textSize]}
          onValueChange={(value) => setTextSize(value[0])}
          max={24}
          min={12}
          step={1}
        />
      </SettingItem>

      <SettingItem icon={<Trash size={20} />} title="Delete Data">
        <button className="text-red-500 hover:underline">Delete All Feedback</button>
      </SettingItem>

      <SettingItem icon={<School size={20} />} title="Default School">
        <Select defaultValue="school_a">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select School" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="school_a">School A</SelectItem>
            <SelectItem value="school_b">School B</SelectItem>
            <SelectItem value="school_c">School C</SelectItem>
            <SelectItem value="school_d">School D</SelectItem>
          </SelectContent>
        </Select>
      </SettingItem>

      <SettingItem icon={<BarChart size={20} />} title="Default Report Range">
        <Select defaultValue="weekly">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </SettingItem>

      <SettingItem icon={<Key size={20} />} title="Change Password">
        <button className="text-blue-500 hover:underline">Change</button>
      </SettingItem>

      <SettingItem icon={<Info size={20} />} title="App Version">
        <span className="text-gray-500">v1.0.0</span>
      </SettingItem>
    </div>
  );
};

export default SettingsPage;