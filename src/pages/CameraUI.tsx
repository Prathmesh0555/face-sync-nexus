import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useFaceRecognition } from '../hooks/useFaceRecognition';
import { useSocket } from '../hooks/useSocket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Camera, Scan, Settings, Wifi, WifiOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const CameraUI = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [sessionData, setSessionData] = useState({
    subject: 'General',
    className: '10th Grade',
    division: 'A',
  });
  const [recognitionHistory, setRecognitionHistory] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    autoScan: false,
    scanInterval: 5000,
    resolution: 'hd',
  });

  const { recognizeFace, isProcessing } = useFaceRecognition();
  const { isConnected, emitEvent, subscribeToEvent } = useSocket();

  React.useEffect(() => {
    // Subscribe to real-time recognition updates
    subscribeToEvent('face-recognition-update', (data) => {
      setRecognitionHistory(prev => [data, ...prev.slice(0, 9)]);
    });

    return () => {
      // Cleanup subscriptions
    };
  }, [subscribeToEvent]);

  const captureAndRecognize = useCallback(async () => {
    if (!webcamRef.current) return;

    setIsScanning(true);
    
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const result = await recognizeFace(
          imageSrc,
          sessionData.subject,
          sessionData.className,
          sessionData.division
        );

        if (result.success) {
          const historyEntry = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            student: result.data?.student,
            status: 'success',
          };
          setRecognitionHistory(prev => [historyEntry, ...prev.slice(0, 9)]);

          // Emit real-time update via socket
          emitEvent('attendance-marked', {
            student: result.data?.student,
            timestamp: new Date(),
            session: sessionData,
          });
        } else {
          const historyEntry = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            status: 'failed',
            error: result.error,
          };
          setRecognitionHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
        }
      }
    } catch (error) {
      console.error('Recognition error:', error);
    } finally {
      setIsScanning(false);
    }
  }, [recognizeFace, sessionData, emitEvent]);

  const videoConstraints = {
    width: settings.resolution === 'hd' ? 1280 : 640,
    height: settings.resolution === 'hd' ? 720 : 480,
    facingMode: 'user',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-primary/5 to-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Camera className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Face Recognition Camera</CardTitle>
                  <CardDescription>
                    Real-time attendance tracking system
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <Badge variant="default" className="flex items-center space-x-1">
                    <Wifi className="w-4 h-4" />
                    <span>Connected</span>
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center space-x-1">
                    <WifiOff className="w-4 h-4" />
                    <span>Disconnected</span>
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Live Camera Feed</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="w-full h-auto"
                  />
                  {(isScanning || isProcessing) && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                        <p>Scanning for faces...</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={captureAndRecognize}
                    disabled={isScanning || isProcessing}
                    className="flex-1"
                  >
                    {isScanning || isProcessing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Scan className="w-4 h-4 mr-2" />
                    )}
                    {isScanning || isProcessing ? 'Scanning...' : 'Scan Face'}
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recognition History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Recognition Results</CardTitle>
              </CardHeader>
              <CardContent>
                {recognitionHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Scan className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No recognition attempts yet</p>
                    <p className="text-sm">Start scanning to see results here</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {recognitionHistory.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          {entry.status === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          )}
                          <div>
                            {entry.status === 'success' ? (
                              <>
                                <p className="font-medium">{entry.student?.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Roll No: {entry.student?.rollNo}
                                </p>
                              </>
                            ) : (
                              <p className="font-medium text-red-600">
                                {entry.error || 'Recognition failed'}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {entry.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Settings</CardTitle>
                <CardDescription>Configure current scanning session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={sessionData.subject}
                    onChange={(e) => setSessionData({...sessionData, subject: e.target.value})}
                    placeholder="Enter subject name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Input
                    id="class"
                    value={sessionData.className}
                    onChange={(e) => setSessionData({...sessionData, className: e.target.value})}
                    placeholder="Enter class name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="division">Division</Label>
                  <Select 
                    value={sessionData.division} 
                    onValueChange={(value) => setSessionData({...sessionData, division: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select division" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Division A</SelectItem>
                      <SelectItem value="B">Division B</SelectItem>
                      <SelectItem value="C">Division C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connection Status</CardTitle>
              </CardHeader>
              <CardContent>
                {isConnected ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Connected to backend server. Real-time updates enabled.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Not connected to backend server. Operating in offline mode.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraUI;