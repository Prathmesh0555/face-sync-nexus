import { useState, useCallback } from 'react';
import { faceAPI } from '../lib/api';
import { useToast } from './use-toast';

export interface RecognitionResult {
  success: boolean;
  data?: {
    student: {
      id: string;
      name: string;
      rollNo: string;
      email: string;
    };
    attendance: {
      id: string;
      date: string;
      subject: string;
      class: string;
      division: string;
    };
  };
  error?: string;
}

export const useFaceRecognition = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const recognizeFace = useCallback(async (
    imageData: string, 
    subject?: string, 
    className?: string, 
    division?: string
  ): Promise<RecognitionResult> => {
    setIsProcessing(true);
    
    try {
      const response = await faceAPI.recognizeFace(imageData, subject, className, division);
      
      if (response.success) {
        toast({
          title: "Face Recognition Successful",
          description: `Attendance marked for ${response.data.student.name}`,
        });
        
        return {
          success: true,
          data: response.data,
        };
      } else {
        toast({
          title: "Recognition Failed",
          description: response.error || 'Face not recognized',
          variant: "destructive",
        });
        
        return {
          success: false,
          error: response.error || 'Face not recognized',
        };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Recognition failed';
      
      toast({
        title: "Recognition Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  return {
    recognizeFace,
    isProcessing,
  };
};