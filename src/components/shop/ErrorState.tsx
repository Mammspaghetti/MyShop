import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" />
      </span>
      <div>
        <h2 className="text-base font-semibold text-foreground">Impossible de charger les données</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {message ?? "Une erreur réseau est survenue."}
        </p>
      </div>
      <Button onClick={onRetry} variant="outline" className="gap-2">
        <RotateCw className="size-4" />
        Réessayer
      </Button>
    </div>
  );
}
