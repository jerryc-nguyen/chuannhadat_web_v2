import { cn } from '@common/utils';
import { IProject } from '../../mobile/searchs/type';

type BusCatTypeProps = {
  busCatType: string;
  project?: IProject;
  className?: string;
};

export default function BusCatType({ busCatType, project, className }: BusCatTypeProps) {
  return (
    <div className={cn("w-full text-secondary", className)}>
      {busCatType.replace('căn hộ chung cư', 'căn hộ')}
      {!!project && (
        <>
          <span> · </span>
          <a href={project.url} className="hover:underline">
            <b>{project.long_name}</b>
          </a>
        </>
      )}
    </div>
  );
}
