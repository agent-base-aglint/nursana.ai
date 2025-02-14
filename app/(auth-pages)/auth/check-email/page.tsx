'use client';

import { MailCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import Footer from '@/components/footer';
import NursanaLogo from '@/components/nursana-logo';
import Section from '@/components/section';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function CheckEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get('type') as string;
  const email = searchParams.get('email') as string;

  const [loginStage, setLoginStage] = useLocalStorage<string | null>(
    'login-stage',
    null,
  );
  function interviewRatingOpenCountHandler() {
    if (type === 'interview' || loginStage === 'first') {
      setLoginStage('first');
    } else {
      setLoginStage('second');
    }
  }

  useEffect(() => {
    interviewRatingOpenCountHandler(); // count for open user interview feedback rating form
  }, []);
  return (
    <Section>
      <div className='flex h-[100vh] flex-col md:items-center justify-between pt-6'>
        <div className='max-md:px-5'> <NursanaLogo /></div>
       
        <div className='flex max-w-[450px] flex-col md:items-center md:justify-center px-4 max-md:h-full max-md:pt-20 max-md:items-start'>
          <MailCheck
            size={60}
            strokeWidth={1.2}
            className='mb-4 text-purple-600'
          />
          <h1 className='mb-4 text-2xl font-medium'>Check Your Inbox</h1>
          <p className='mb-1 md:text-center'>
            {type === 'interview'
              ? `We've sent an interview link to ${email.replaceAll(' ', '+')}.`
              : `We've sent a login link to ${email.replaceAll(' ', '+')}.`}
          </p>
          <p className='mb-8 text-sm text-muted-foreground'>
            {`If you don't see the email, check your spam folder.`}
          </p>
          <Button onClick={() => router.push('/')}>Back to Home Page</Button>
        </div>
        <Footer />
      </div>
    </Section>
  );
}
