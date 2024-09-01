import { Metadata } from 'next';
import { DemoReportAnIssue } from './report-an-issue';

export const metadata: Metadata = {
  title: 'Create new post',
  description: 'Create new post',
};

const NewPostPage: React.FC = () => {
  return (
    // <div className="grid grid-cols-4 gap-4">
      <DemoReportAnIssue />
    // </div>
  )
};

export default NewPostPage;
