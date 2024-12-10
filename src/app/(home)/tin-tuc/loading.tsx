import { CardNewSkeleton } from "@views/news/components/Skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-4">
      {[...Array(12)].map((_, index) => (
        <CardNewSkeleton key={index} />
      ))}
    </div>
  );
}
