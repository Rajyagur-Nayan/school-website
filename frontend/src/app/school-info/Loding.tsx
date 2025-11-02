import { Loader2 } from "lucide-react";

export default function Loading() {
  // This is the initial UI shown to the user
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
