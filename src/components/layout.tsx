import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Code } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("bg-background min-h-screen font-sans antialiased")}>
      <div className="container mx-auto h-full min-h-dvh border-r border-l border-dashed">
        <div className="mx-auto border-b border-dashed p-4">
          <div className="bg-card flex items-center rounded-lg border p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <a
                href="/"
                className="text-foreground text-xl font-bold hover:underline sm:text-2xl"
              >
                valolab
              </a>
              <span className="text-foreground mt-1 text-xs sm:ml-2 sm:text-sm">
                by{" "}
                <a
                  href="https://github.com/malik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  malik
                </a>
              </span>
            </div>
            <div className="ml-auto flex gap-2">
              <Button
                className="bg-primary flex md:hidden lg:flex"
                asChild
                variant={"default"}
              >
                <a
                  href="https://github.com/velolib/valolab"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code className="size-4.5" />
                  <span>Source Code</span>
                </a>
              </Button>
              <ModeToggle />
            </div>
          </div>
        </div>
        <div className="mx-auto h-full p-4">{children}</div>
      </div>
    </div>
  );
}
