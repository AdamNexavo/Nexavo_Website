import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FaqKennisbankLinkProps = {
  className?: string;
  purple?: boolean;
};

export const FaqKennisbankLink = ({ className, purple = false }: FaqKennisbankLinkProps) => (
  <Button
    asChild
    variant={purple ? "brand" : "outline"}
    size="lg"
    className={cn(
      purple
        ? "group px-4 shadow-none"
        : "group border-border/60 bg-white px-4 text-foreground shadow-none hover:border-border hover:bg-white",
      className,
    )}
  >
    <Link to="/kennisbank" aria-label="Kennisbank">
      <Lightbulb
        className={cn("h-4 w-4", purple ? "text-white" : "text-muted-foreground")}
        strokeWidth={1.75}
      />
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  </Button>
);
