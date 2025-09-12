import ReferralFriendPage from '@frontend/ReferralFriend';
type Params = Promise<{ referral_code: string[] }>;
type ReferralPageProps = {
  params: Params;
};

const ReferralPage: React.FC<ReferralPageProps> = async ({ params }) => {
  const { referral_code } = await params;
  return <ReferralFriendPage referral_code={referral_code[0]} />;
};

export default ReferralPage;
