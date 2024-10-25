import Link from 'next/link';

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { useTemplates } from '@/templates/hooks/useTemplates';
import { type Template } from '@/templates/types';

import { useList } from './Context';

export const TemplateList = () => {
  const { search } = useList();
  const templates = useTemplates();
  const filteredTemplates = templates.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase()),
  );
  if (filteredTemplates.length === 0)
    return <div className='w-full p-4'>No Campaigns found</div>;

  return (
    <SidebarContent>
      <SidebarGroup className='px-0'>
        <SidebarGroupContent>
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} {...template} />
          ))}
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

const TemplateCard = (props: Template) => {
  const { name, version: versions } = props;
  return (
    <>
          {name}
            {versions.map((version) => (
              <VersionCard key={version.id} version={version} />
            ))}
    </>
  );
};

const VersionCard = ({ version }: { version: Template['version'][number] }) => {
  const { name, id } = version;
  return (
    <Link
      href={`/templates/${id}`}
      className='flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
    >
      {name}
    </Link>
  );
};
