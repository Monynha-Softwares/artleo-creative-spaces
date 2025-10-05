import { Skeleton } from "@/components/ui/skeleton";

export const ArtworkSkeleton = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full aspect-[4/3] rounded-lg" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
};
