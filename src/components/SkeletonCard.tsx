export default function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 flex flex-col items-center gap-3 animate-pulse">
      <div className="w-28 h-28 rounded-full bg-gray-100" />
      <div className="h-4 w-24 rounded bg-gray-100" />
      <div className="h-3 w-12 rounded bg-gray-100" />
      <div className="flex gap-2">
        <div className="h-5 w-14 rounded-full bg-gray-100" />
        <div className="h-5 w-14 rounded-full bg-gray-100" />
      </div>
    </div>
  )
}
