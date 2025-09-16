import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Bell, Clock, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'New Student Enrollment',
      message: 'A new student has enrolled in your CS-301 course.',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'alert',
      title: 'Schedule Change',
      message: 'Your Tuesday 2 PM class has been moved to Room B-203.',
      timestamp: '1 day ago',
      read: false,
    },
    {
      id: 3,
      type: 'success',
      title: 'Attendance Marked',
      message: 'Face recognition successfully marked attendance for 25 students.',
      timestamp: '2 days ago',
      read: true,
    },
    {
      id: 4,
      type: 'info',
      title: 'Faculty Meeting',
      message: 'Department meeting scheduled for Friday at 3 PM.',
      timestamp: '3 days ago',
      read: true,
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle className="text-2xl">Notifications</CardTitle>
                    <CardDescription>
                      Stay updated with the latest information
                    </CardDescription>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <Button onClick={markAllAsRead} variant="outline">
                    Mark All as Read
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Notifications Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="read">
                Read ({notifications.length - unreadCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className={`transition-all duration-200 ${
                  !notification.read ? 'border-primary/50 bg-primary/5' : 'bg-card'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-foreground">
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <Badge variant="secondary">New</Badge>
                            )}
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="w-4 h-4 mr-1" />
                              {notification.timestamp}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="text-primary hover:text-primary-foreground hover:bg-primary"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="unread" className="space-y-4">
              {notifications.filter(n => !n.read).map((notification) => (
                <Card key={notification.id} className="border-primary/50 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-foreground">
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">New</Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="w-4 h-4 mr-1" />
                              {notification.timestamp}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          {notification.message}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="text-primary hover:text-primary-foreground hover:bg-primary"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark as Read
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {notifications.filter(n => !n.read).length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                    <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                    <p className="text-muted-foreground">You have no unread notifications.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="read" className="space-y-4">
              {notifications.filter(n => n.read).map((notification) => (
                <Card key={notification.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-foreground">
                            {notification.title}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            {notification.timestamp}
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Notifications;