import { Metadata } from 'next';
import BotProtectionDashboard from '@/lib/botProtectionDashboard';

export const metadata: Metadata = {
  title: 'Bot Protection Dashboard',
  description: 'Monitor and analyze bot traffic on your website',
};

export default function BotDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BotProtectionDashboard />
    </div>
  );
} 
