import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="h-8 bg-navy" />
      <div className="container-shell flex h-24 items-center gap-5"><Skeleton className="h-10 w-44" /><Skeleton className="hidden h-11 flex-1 lg:block" /></div>
      <div className="bg-navy py-20"><div className="container-shell"><Skeleton className="h-4 w-56 bg-white/10" /><Skeleton className="mt-6 h-14 max-w-2xl bg-white/10" /><Skeleton className="mt-4 h-14 max-w-xl bg-white/10" /></div></div>
    </main>
  );
}
