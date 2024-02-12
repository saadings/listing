"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const columns: ColumnDef<ReturnVelocitiesByDateRange>[] = [
  {
    accessorFn: (row) => row.fromDate,
    id: "fromDate",
    header: "From Date",
    cell: ({ getValue }) => (
      <div>{new Date(getValue() as string).toLocaleDateString()}</div>
    ),
  },
  {
    accessorFn: (row) => row.toDate,
    id: "toDate",
    header: "To Date",
    cell: ({ getValue }) => (
      <div>{new Date(getValue() as string).toLocaleDateString()}</div>
    ),
  },
  {
    id: "vendorName",
    accessorFn: (row) => row.vendor.name,
    header: "Vendor Name",
    cell: ({ getValue }) => (
      <div className="capitalize">{String(getValue())}</div>
    ),
  },
  {
    accessorKey: "partNumber",
    header: "Vendor Part Number",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("partNumber")}</div>
    ),
  },
  {
    id: "manufacturerPartNumber",
    accessorFn: (row) => row.manufacturer.partNumber,
    header: "Manufacturer Part Number",
    cell: ({ getValue }) => (
      <div className="lowercase">{String(getValue())}</div>
    ),
  },
  {
    accessorKey: "positiveVelocityQuantity",
    header: "Quantity (+) Velocity",
    cell: ({ row }) => (
      <div className="lowercase">
        {row.getValue("positiveVelocityQuantity")}
      </div>
    ),
  },
  {
    accessorKey: "negativeVelocityQuantity",
    header: "Quantity (-) Velocity",
    cell: ({ row }) => (
      <div className="lowercase">
        {row.getValue("negativeVelocityQuantity")}
      </div>
    ),
  },
  {
    accessorKey: "velocityPrice",
    header: "Price Velocity",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("velocityPrice")}</div>
    ),
  },
];

export function DataGrid({
  velocities,
}: {
  velocities: ReturnVelocitiesByDateRange[];
}) {
  const table = useReactTable({
    data: velocities,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
