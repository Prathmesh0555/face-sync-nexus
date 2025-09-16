import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

interface AttendanceModalProps {
  classData: any;
  onClose: () => void;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({ classData, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{classData.title} - Attendance</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Attendance modal for {classData.class}</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};