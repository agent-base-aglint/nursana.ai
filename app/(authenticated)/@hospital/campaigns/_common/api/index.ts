import { createTRPCRouter } from '@/server/api/trpc';

import { read } from './read';
import { campaign } from './campaign';

export const campaigns = createTRPCRouter({
  read,
  campaign,
});
