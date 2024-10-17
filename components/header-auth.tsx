'use client';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useUserData } from '@/authenicated/hooks/useUserData';
import { useLogout } from '@/common/hooks/useLogout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function HeaderAuth() {
  const { userData } = useUserData();
  const { logout } = useLogout();
  const queryClient = useQueryClient();
  const [hasIncompleteInterview, setHasIncompleteInterview] = useState(false);

  useEffect(() => {
    if (userData?.interview) {
      setHasIncompleteInterview(
        userData.interview?.interview_stage !== 'interview_completed',
      );
    }
  }, [userData]);

  if (!userData?.interview) {
    return (
      <div className='flex gap-2'>
        <Button asChild variant={'default'}>
          <Link href='/campaign/?campaign_code=SUMMER23NURSE'>Get Started</Link>
        </Button>
      </div>
    );
  }

  const userInitials =
    userData?.user?.first_name && userData.user.last_name
      ? `${userData.user.first_name[0]}${userData.user.last_name[0]}`
      : userData?.user?.email?.[0] || '?';

  return (
    <div className='flex items-center gap-4'>
      {hasIncompleteInterview && (
        <Badge variant='destructive'>Incomplete Interview</Badge>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className='cursor-pointer rounded-md'>
            <AvatarFallback className='bg-purple-600 text-white rounded-md'>{userInitials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem asChild>
            <Link href='/dashboard'>Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/' onClick={() => logout(queryClient)}>
              Sign out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
