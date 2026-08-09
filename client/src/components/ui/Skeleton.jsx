export const SkeletonCard = () => (
  <div className="card p-5 space-y-3">
    <div className="skeleton h-5 w-2/3" />
    <div className="skeleton h-4 w-full" />
    <div className="skeleton h-4 w-5/6" />
    <div className="flex gap-2 pt-2">
      <div className="skeleton h-6 w-16 rounded-full" />
      <div className="skeleton h-6 w-16 rounded-full" />
    </div>
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-3 p-4">
    <div className="skeleton w-10 h-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="skeleton h-4 w-1/3" />
      <div className="skeleton h-3 w-1/2" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
