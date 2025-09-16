import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { AttendanceModal } from './AttendanceModal';

const scheduleData = [
  {
    id: 1,
    title: 'Data Structures',
    class: 'CS-301',
    time: '09:00 - 10:30',
    location: 'Room A-101',
    students: '45',
    day: 'Monday'
  },
  {
    id: 2,
    title: 'Database Systems',
    class: 'CS-401',
    time: '11:00 - 12:30',
    location: 'Lab B-203',
    students: '38',
    day: 'Monday'
  },
  {
    id: 3,
    title: 'Algorithm Analysis',
    class: 'CS-501',
    time: '14:00 - 15:30',
    location: 'Room A-105',
    students: '32',
    day: 'Tuesday'
  }
];

export const WeeklySchedule = () => {
  const [selectedClass, setSelectedClass] = useState(null);

  const handleTakeAttendance = (classData) => {
    setSelectedClass(classData);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Weekly Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduleData.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <Badge variant="secondary">{item.class}</Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{item.students} students</span>
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleTakeAttendance(item)}
                    >
                      Take Attendance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedClass && (
        <AttendanceModal
          classData={selectedClass}
          onClose={() => setSelectedClass(null)}
        />
      )}
    </>
  );
};