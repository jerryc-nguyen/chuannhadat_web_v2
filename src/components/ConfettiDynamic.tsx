/**
 * Dynamic Confetti Component
 * 
 * Dynamically imports react-confetti (~25KB) only when celebration is needed
 * Perfect for payment success, achievements, or congratulations
 */

import { lazy, Suspense, ComponentProps } from 'react';

// Dynamic import for confetti
const Confetti = lazy(() => import('react-confetti'));

type ConfettiDynamicProps = ComponentProps<typeof Confetti>;

const ConfettiLoader = () => null; // No loading state needed for celebrations

export default function ConfettiDynamic(props: ConfettiDynamicProps) {
  // Don't render anything if not running
  if (!props.run) {
    return null;
  }

  return (
    <Suspense fallback={<ConfettiLoader />}>
      <Confetti {...props} />
    </Suspense>
  );
}

// Utility component for common celebration scenarios
export function CelebrationConfetti({
  isVisible,
  ...props
}: {
  isVisible: boolean
} & Partial<ConfettiDynamicProps>) {
  if (!isVisible) return null;

  return (
    <ConfettiDynamic
      numberOfPieces={100}
      recycle={true}
      run={isVisible}
      {...props}
    />
  );
}
