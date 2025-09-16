import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { WeeklySchedule } from '../components/WeeklySchedule';
import { MenteeGoals } from '../components/MenteeGoals';
import { StudentMessages } from '../components/StudentMessages';
import { FacultyCommunication } from '../components/FacultyCommunication';
import { Card, CardContent } from '../components/ui/card';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Header */}
          <Card>
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {user.name.split(' ')[1] || user.name}!
              </h1>
              <p className="text-muted-foreground text-lg">
                Here's what's happening in your academic world today.
              </p>
            </CardContent>
          </Card>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Schedule */}
            <div className="lg:col-span-2">
              <WeeklySchedule />
            </div>

            {/* Mentee Goals */}
            <div>
              <MenteeGoals />
            </div>

            {/* Student Messages */}
            <div>
              <StudentMessages />
            </div>

            {/* Faculty Communication */}
            <div className="lg:col-span-2">
              <FacultyCommunication />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;