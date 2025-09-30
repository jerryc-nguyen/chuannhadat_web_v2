import { IUser } from '@/common/types';
import ProfileDetailMobile from '@frontend/ProfileDetail/ProfileDetailMobile';

interface UserProps {
  user: IUser;
}

export default function InfoCard({ user }: UserProps) {
  return <ProfileDetailMobile profileSlug={user.slug} />;
}
