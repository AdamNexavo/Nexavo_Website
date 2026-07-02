import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FeatureRow = {
  label: string;
  values: (string | boolean)[];
};

type FeatureTableProps = {
  headers: string[];
  rows: FeatureRow[];
  className?: string;
  stickyHeader?: boolean;
};

export const FeatureTable = ({
  headers,
  rows,
  className,
  stickyHeader = true,
}: FeatureTableProps) => (
  <div className={cn("overflow-x-auto -mx-5 sm:mx-0", className)}>
    <Table>
      <TableHeader className={stickyHeader ? "sticky top-0 z-10 bg-background/95 backdrop-blur-sm" : ""}>
        <TableRow className="border-border/60 hover:bg-transparent">
          {headers.map((header, i) => (
            <TableHead
              key={header}
              className={cn(
                "nex-table-header py-4 px-4 md:px-6",
                i > 0 && "text-center",
              )}
            >
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.label} className="border-border/50 hover:bg-muted/20">
            <TableCell className="py-4 px-4 md:px-6 text-sm font-medium text-foreground">
              {row.label}
            </TableCell>
            {row.values.map((value, i) => (
              <TableCell key={i} className="py-4 px-4 md:px-6 text-center">
                {typeof value === "boolean" ? (
                  value ? (
                    <Check className="h-4 w-4 mx-auto text-muted-foreground" strokeWidth={2.5} />
                  ) : (
                    <X className="h-4 w-4 mx-auto text-muted-foreground/40" strokeWidth={2} />
                  )
                ) : (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
