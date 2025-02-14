import 'server-only'; /* eslint-disable no-console */

import { z } from 'zod';

import { createPublicClient } from '@/db/client';
import { type PublicProcedure, publicProcedure } from '@/server/api/trpc';

export const schema = z.object({
  email: z.string().email(),
  campaign_id: z.string(),
});

const query = async ({
  input: { email, campaign_id },
}: PublicProcedure<typeof schema>) => {
  const db = createPublicClient();
  const app_user = (
    await db
      .from('user')
      .select('*, applicant_user(*)')
      .eq('email', email)
      .throwOnError()
  ).data!;

  const resume = app_user[0]?.applicant_user
    ? (
        await db
          .from('resume')
          .select('*')
          .eq('campaign_id', campaign_id)
          .eq('applicant_id', app_user[0].applicant_user.id)
          .throwOnError()
      ).data
    : null;

  const interview = app_user[0]?.applicant_user
    ? (
        await db
          .from('interview')
          .select('*')
          .eq('applicant_id', app_user[0]?.applicant_user.id)
          .throwOnError()
      ).data
    : null;

  return {
    user_id: app_user ? app_user[0]?.id : null,
    applicant_id: app_user[0]?.applicant_user
      ? app_user[0].applicant_user.id
      : null,
    resume: resume ? resume[0] : null,
    role: app_user[0]?.user_role ? app_user[0].user_role : null,
    interview: interview ? interview[0] : null,
  };
};

export const userCheck = publicProcedure.input(schema).query(query);
