import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import HowItWorks from "@/components/how-it-works";

const ResumeUpload = dynamic(() => import("@/components/resume-upload"), {
  ssr: false,
});

const InterviewInstructions = dynamic(
  () => import("@/components/interview-instructions"),
  {
    ssr: false,
  }
);

const InterviewSummary = dynamic(
  () => import("@/components/interview-summary"),
  {
    ssr: false,
  }
);

const normalizeStage = (stage: string) => {
  switch (stage) {
    case "not_started":
      return "get-started";
    case "resume_submitted":
    case "interview_inprogress":
      return "start-interview";
    case "interview_completed":
      return "summary";
    default:
      return "get-started"; // Default to get-started if unknown stage
  }
};

export default async function InterviewPage({
  params,
}: {
  params: { id: string; stage: string };
}) {
  const supabase = createClient();
  const { data: interview, error } = await supabase
    .from("interviews")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !interview) {
    console.error("Error fetching interview:", error);
    notFound();
  }

  const normalizedStage = normalizeStage(interview.interview_stage);
  let redirectStage = normalizedStage;

  // Check and adjust the stage based on interview progress
  if (
    params.stage === "summary" &&
    interview.interview_stage !== "interview_completed"
  ) {
    redirectStage = "start-interview";
  } else if (
    params.stage === "start-interview" &&
    interview.interview_stage === "not_started"
  ) {
    redirectStage = "get-started";
  }

  // Redirect if the requested stage doesn't match the allowed stage
  if (params.stage !== redirectStage) {
    return redirect(`/interview/${params.id}/${redirectStage}`);
  }

  const renderComponent = () => {
    switch (redirectStage) {
      case "get-started":
        return (
          <Suspense fallback={<div>Loading Resume Upload...</div>}>
            <div className="flex flex-col gap-28 items-center">
            <HowItWorks/>
            <ResumeUpload
              key={params.id}
              userId={interview.nurse_id}
              interviewId={params.id}
            />
            </div>
          </Suspense>
        );
      case "start-interview":
        return (
          <Suspense fallback={<div>Loading Instructions...</div>}>
            <InterviewInstructions
              key={params.id}
              interviewId={params.id}
              interviewData={interview}
            />
          </Suspense>
        );
      case "summary":
        return (
          <Suspense fallback={<div>Loading Summary...</div>}>
            <InterviewSummary
              key={params.id}
              interviewId={params.id}
              interviewData={interview}
            />
          </Suspense>
        );
      default:
        console.log("Unknown stage:", redirectStage);
        notFound();
    }
  };

  return <div key={`${params.id}-${redirectStage}`}>{renderComponent()}</div>;
}
