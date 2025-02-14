import {
  Brain,
  Lightbulb,
  Puzzle,
  TvMinimalPlay,
  UserCheck,
  Zap,
} from 'lucide-react';

import NotAvailable from '@/dashboard/components/NotAvailable';
import ProgressBarCard from '@/dashboard/components/ProgressBarCard';
import RadialProgress from '@/dashboard/components/RadialProgress';
import type { DBTable } from '@/server/db/types';

import { RadarChartInterview } from './RadarChartInterview';
import { RatingBar } from './RatingBar';

const ErrorFallback = () => {
  return (
    <NotAvailable
      heading='Interview hasn’t been completed yet.'
      description=''
      Icon={TvMinimalPlay}
      actionBtn={<></>}
    />
  );
};

export const InterviewAnalysisUI = ({
  analysis,
  isCandidateView = false,
}: {
  analysis: DBTable<'interview_analysis'>['structured_analysis'];
  isCandidateView?: boolean;
}) => {
  if (!analysis) return <ErrorFallback />;

  const articulation = analysis.articulation;
  const confidence_level = analysis.confidence_level;
  const communication_gaps = analysis.communication_gaps;
  const engagement_responsiveness = analysis.engagement_responsiveness;
  const adaptability_stress_management =
    analysis.adaptability_stress_management;

  const summary = isCandidateView
    ? analysis.overall_feedback
    : analysis.overall_summary;

  return (
    <div className='mx-auto max-w-4xl p-0 lg:container max-lg:py-5 lg:py-10'>
      <div className='text-md mb-3 font-medium lg:mb-6 lg:text-xl'>
        Analysis ( Transcript )
      </div>
      <div className='mb-20 flex flex-col gap-8'>
        <AnalysisInterview
          overallScore={analysis?.overall_score ?? 0}
          summary={summary || 'No summary available.'}
        />
        <RadarChartInterview analysis={analysis} />
        <div className='flex flex-col gap-8'>
          {articulation && (
            <RatingBar
              label='Articulation'
              score={articulation.score * 2}
              explanation={
                isCandidateView
                  ? articulation.feedback
                  : articulation.explanation
              }
              icon={<Brain className='h-5 w-5 text-purple-600' />}
              maxValue={10}
            />
          )}

          {confidence_level && (
            <RatingBar
              label='Confidence Level'
              score={confidence_level.score * 2}
              explanation={
                isCandidateView
                  ? confidence_level.feedback
                  : confidence_level.explanation
              }
              icon={<Zap className='h-5 w-5 text-purple-600' />}
              maxValue={10}
            />
          )}

          {communication_gaps && (
            <RatingBar
              label='Communication Gaps'
              score={communication_gaps.score * 2}
              explanation={
                isCandidateView
                  ? communication_gaps.feedback
                  : communication_gaps.explanation
              }
              icon={<Puzzle className='h-5 w-5 text-purple-600' />}
              maxValue={10}
            />
          )}

          {engagement_responsiveness && (
            <RatingBar
              label='Engagement & Responsiveness'
              score={engagement_responsiveness.score * 2}
              explanation={
                isCandidateView
                  ? engagement_responsiveness.feedback
                  : engagement_responsiveness.explanation
              }
              icon={<UserCheck className='h-5 w-5 text-purple-600' />}
              maxValue={10}
            />
          )}

          {adaptability_stress_management && (
            <RatingBar
              label='Adaptability & Stress Management'
              score={adaptability_stress_management.score * 2}
              explanation={
                isCandidateView
                  ? adaptability_stress_management.feedback
                  : adaptability_stress_management.explanation
              }
              icon={<Lightbulb className='h-5 w-5 text-purple-600' />}
              maxValue={10}
            />
          )}
        </div>
      </div>
    </div>
  );
};

InterviewAnalysisUI.ErrorFallback = ErrorFallback;
const AnalysisInterview = ({
  overallScore,
  summary,
}: {
  summary: string;
  overallScore: number;
}) => {
  const chartData = [
    {
      name: 'Score',
      value: overallScore,
      fill: '#8b5cf6',
      path: '#ddd6fe',
    },
  ];

  return (
    <div className='flex flex-col gap-2'>
      <ProgressBarCard summary={summary} color='purple'>
        <RadialProgress chartData={chartData} size={200} />
      </ProgressBarCard>
    </div>
  );
};
