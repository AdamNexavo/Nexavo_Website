import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function InvoicePdfButton({
  pdfUrl,
  className,
  size = "sm",
}: {
  pdfUrl?: string | null;
  className?: string;
  size?: "sm" | "md";
}) {
  const { toast } = useToast();
  const base =
    "inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors";
  const sizing = size === "sm" ? "px-3 py-1.5 text-[12px]" : "px-4 py-2 text-[13px]";

  if (pdfUrl) {
    return (
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          base,
          sizing,
          "border-[#D1D5DB] bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]",
          className,
        )}
      >
        <FileText className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
        PDF
      </a>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={size === "sm" ? "sm" : "default"}
      disabled
      className={cn(
        "rounded-full border-[#D1D5DB] bg-[#F3F4F6] text-[#9CA3AF] hover:bg-[#F3F4F6]",
        className,
      )}
      onClick={() =>
        toast({
          title: "PDF niet beschikbaar",
          description: "PDF wordt later beschikbaar gesteld in je portaal.",
        })
      }
    >
      <FileText className="mr-1.5 h-3.5 w-3.5" />
      PDF
    </Button>
  );
}
