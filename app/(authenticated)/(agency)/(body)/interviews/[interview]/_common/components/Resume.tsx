import { ErrorBoundary } from 'react-error-boundary';

import { ResumeFeedbackUI } from '@/authenticated/components/ResumeFeedbackUI';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useInterviewResume } from '@/interview/hooks/useInterviewResume';

export const Resume = () => {
  return (
    <ErrorBoundary fallback={<>Resume analysis unavailable</>}>
      <Content />
    </ErrorBoundary>
  );
};

const Content = () => {
  const resume = useInterviewResume();
  return (
    <ScrollArea className='mx-auto h-[800px] max-w-5xl'>
      <ResumeFeedbackUI resume={resume} />
    </ScrollArea>
  );
};
