import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type IntakeValidationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  errors: string[];
};

export function IntakeValidationDialog({
  open,
  onOpenChange,
  title = "Stap nog niet compleet",
  errors,
}: IntakeValidationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-[16px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2 pt-1 text-left text-[14px] text-[#6B7280]">
              <p>Vul eerst onderstaande verplichte velden in voordat je verder kunt:</p>
              <ul className="list-inside list-disc space-y-1 text-[#111111]">
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="rounded-[12px] bg-[#111111] hover:bg-[#0B0B0D]">
            Begrepen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
