"use client";
import { ResumeReview } from "@/app/components/ResumeReview";
import { InterviewTranscript } from "@/app/components/InterviewTranscript";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, ExternalLink } from "lucide-react";
import { useNurseData } from "@/app/hooks/useNurseData";
import { format } from "date-fns";
import { useAuth } from "@/app/contexts/AuthContext";
import { PreferencesView } from "@/app/components/PreferencesView";
import { PreferencesEdit } from "@/app/components/PreferencesEdit";
import {
  InterviewAnalysis,
  type AIAnalysis,
} from "@/app/components/InterviewAnalysis";
import { VideoPlayer } from "@/app/components/VideoPlayer";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { AudioPlayer } from "@/app/components/AudioPlayer";

export default function NurseHomePage() {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    refetch();
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const { userId } = useAuth();
  console.log("userId from the nurse home page", userId);
  // interview ID cad4cf00-6371-46eb-b51a-5bb97bc5a930
  const nurseId = "d6b2cf82-3f60-4886-893e-b472fb56b9e8";
  const { data: nurseData, isLoading, error, refetch } = useNurseData(nurseId);
  console.log("nurseData from the nurse home page", nurseData);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <span className="text-sm text-purple-600">
            ✦ Welcome, {nurseData?.nurse?.first_name || "to Nursera"}
          </span>
          <h1 className="text-xl font-bold mb-4">
            Find you interview & resume feedback here
          </h1>
          <Tabs defaultValue="interview">
            <TabsList className="mb-4">
              <TabsTrigger value="interview">Interview Feedback</TabsTrigger>
              <TabsTrigger value="resume">Resume Review</TabsTrigger>
              <TabsTrigger value="transcript">Interview Transcript</TabsTrigger>
            </TabsList>
            <TabsContent value="resume">
              {nurseData?.resume?.structured_resume ? (
                <ResumeReview data={nurseData.resume.structured_resume} />
              ) : (
                <p>No resume feedback available.</p>
              )}
            </TabsContent>
            <TabsContent value="interview">
              {nurseData?.analysis?.call_analysis && (
                <InterviewAnalysis
                  analysis={nurseData.analysis.call_analysis as AIAnalysis}
                />
              )}
            </TabsContent>
            <TabsContent value="transcript">
              {nurseData?.analysis?.transcript ? (
                <InterviewTranscript
                  transcript={nurseData.analysis.transcript}
                />
              ) : (
                <p>No interview transcript available.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <h2 className="text-md font-medium mb-2">Recorded Interview</h2>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {nurseData?.interview?.created_at
                ? format(
                    new Date(nurseData.interview.created_at),
                    "dd MMMM yyyy"
                  )
                : "N/A"}
            </div>
            <div className="flex items-center">
              {/* */}
              {nurseData?.analysis?.duration
                ? `${Math.round(nurseData.analysis.duration)} Minutes at `
                : "N/A"}{" "}
              {nurseData?.interview?.created_at
                ? format(new Date(nurseData.interview.created_at), "hh:mm a")
                : "N/A"}
            </div>
          </div>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {nurseData?.analysis?.video_url ? (
                <VideoPlayer videoUrl={nurseData.analysis.video_url} />
              ) : (
                <AspectRatio ratio={16 / 9}>
                  <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                    No video available
                  </div>
                </AspectRatio>
              )}
            </CardContent>
          </Card>

          {nurseData?.analysis?.audio_url && (
            <AudioPlayer audioUrl={nurseData.analysis.audio_url} />
          )}
          <Card className="mb-6 bg-gray-50 group cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-cente">
                  <FileText
                    className="w-10 h-10 text-muted-foreground"
                    strokeWidth={1}
                  />
                </div>
                <div>
                  <p className="font-medium text-sm text-muted-foreground">
                    {nurseData?.resume?.file_name || "No resume uploaded"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {nurseData?.resume?.file_size || "N/A"}
                  </p>
                </div>
                {nurseData?.resume?.file_url && (
                  <div className="group relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <a
                        href={nurseData.resume.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {isEditing ? (
            <PreferencesEdit
              nurseData={nurseData?.nurse || null}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <PreferencesView
              nurseData={nurseData?.nurse || null}
              onEdit={handleEdit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
