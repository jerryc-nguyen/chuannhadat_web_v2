import { ImSpinner6 } from 'react-icons/im';
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <section className="flex h-screen w-screen items-center justify-center">
      <ImSpinner6 className="animate-spin text-4xl text-white" />
    </section>
  );
}
