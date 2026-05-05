"use client";

import { useState } from "react";
import { Info, Lightbulb, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface SectionInstructionsProps {
  title: string;
  description: string;
  tips?: string[];
  className?: string;
}

function InstructionsContent({
  title,
  description,
  tips = [],
}: Omit<SectionInstructionsProps, "className">) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/10 p-2 shrink-0">
          <Info className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-2 flex-1">
          <h3 className="font-semibold text-base">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {tips.length > 0 && (
        <div className="pt-4 border-t space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <span>Tips</span>
          </div>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function SectionInstructionsButton({
  title,
  description,
  tips = [],
}: Omit<SectionInstructionsProps, "className">) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 shrink-0 gap-2 border-muted-foreground/30 bg-muted/50 hover:bg-muted hover:border-muted-foreground/50 text-foreground font-medium transition-all duration-200 min-[1920px]:hidden"
          aria-label="View instructions and tips"
        >
          <Info className="h-4 w-4" />
          <span className="hidden sm:inline">Instructions & Tips</span>
          <span className="sm:hidden">Tips</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Instructions and tips for {title}
          </DialogDescription>
        </DialogHeader>
        <div className="pt-2">
          <InstructionsContent
            title={title}
            description={description}
            tips={tips}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SectionInstructions({
  title,
  description,
  tips = [],
  className,
}: SectionInstructionsProps) {
  return (
    <Card className={cn("sticky top-6 h-fit hidden min-[1920px]:block", className)}>
      <CardContent className="p-6">
        <InstructionsContent
          title={title}
          description={description}
          tips={tips}
        />
      </CardContent>
    </Card>
  );
}

