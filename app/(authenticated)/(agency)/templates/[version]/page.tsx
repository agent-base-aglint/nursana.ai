import { SidebarInset } from '@/components/ui/sidebar';

import { Body } from './_common/components/Body';
import { VersionDashboard } from './_common/components/Dashboard';

const Page = () => {
  return (
    <SidebarInset>
      <Body>
        <VersionDashboard />
      </Body>
    </SidebarInset>
  );
};

export default Page;
