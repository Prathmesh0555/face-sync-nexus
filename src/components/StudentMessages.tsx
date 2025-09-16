import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MessageSquare } from 'lucide-react';

export const StudentMessages = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5" />
          <span>Student Messages</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Connect to backend to load messages</p>
        </div>
      </CardContent>
    </Card>
  );
};