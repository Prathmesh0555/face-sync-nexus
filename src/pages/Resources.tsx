import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BookOpen, FileText, Video, Link, Download, Search, Filter } from 'lucide-react';

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const resources = [
    {
      id: 1,
      title: 'Advanced Data Structures Lecture Notes',
      type: 'document',
      subject: 'CS-301',
      description: 'Comprehensive notes covering trees, graphs, and advanced algorithms.',
      uploadDate: '2024-03-15',
      size: '2.4 MB',
      downloads: 45,
    },
    {
      id: 2,
      title: 'Database Design Tutorial Video',
      type: 'video',
      subject: 'CS-401',
      description: 'Step-by-step guide to designing efficient database schemas.',
      uploadDate: '2024-03-12',
      size: '156 MB',
      downloads: 23,
    },
    {
      id: 3,
      title: 'Algorithm Analysis Reference',
      type: 'document',
      subject: 'CS-501',
      description: 'Quick reference guide for time and space complexity analysis.',
      uploadDate: '2024-03-10',
      size: '1.8 MB',
      downloads: 67,
    },
    {
      id: 4,
      title: 'Programming Best Practices',
      type: 'link',
      subject: 'General',
      description: 'External resource on clean coding practices and standards.',
      uploadDate: '2024-03-08',
      size: 'External',
      downloads: 34,
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'link':
        return <Link className="w-5 h-5 text-green-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle className="text-2xl">Resources</CardTitle>
                    <CardDescription>
                      Manage and share educational resources with your students
                    </CardDescription>
                  </div>
                </div>
                <Button>
                  Upload New Resource
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resources Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(resource.type)}
                          <Badge variant="secondary" className="text-xs">
                            {resource.subject}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {resource.downloads} downloads
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {resource.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Size: {resource.size}</span>
                        <span>Uploaded: {resource.uploadDate}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-1" />
                          {resource.type === 'link' ? 'Open' : 'Download'}
                        </Button>
                        <Button size="sm" variant="outline">
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.filter(r => r.type === 'document').map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(resource.type)}
                          <Badge variant="secondary" className="text-xs">
                            {resource.subject}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {resource.downloads} downloads
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {resource.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Size: {resource.size}</span>
                        <span>Uploaded: {resource.uploadDate}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.filter(r => r.type === 'video').map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(resource.type)}
                          <Badge variant="secondary" className="text-xs">
                            {resource.subject}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {resource.downloads} downloads
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {resource.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Size: {resource.size}</span>
                        <span>Uploaded: {resource.uploadDate}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="links" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.filter(r => r.type === 'link').map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(resource.type)}
                          <Badge variant="secondary" className="text-xs">
                            {resource.subject}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {resource.downloads} visits
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {resource.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Type: {resource.size}</span>
                        <span>Added: {resource.uploadDate}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Link className="w-4 h-4 mr-1" />
                          Open Link
                        </Button>
                        <Button size="sm" variant="outline">
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Resources;