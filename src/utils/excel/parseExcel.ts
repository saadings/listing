import { Worksheet } from "exceljs";

export const parseExcel = (df: Worksheet): ParseExcelDataProps[] => {
  // try {
    const rows: ParseExcelDataProps[] = [];

    if (!isValidColumns(df, expectedColumnNames)) {
      throw new Error("Invalid Excel columns.");
    }

    df.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        return;
      }

      const values = Array.isArray(row.values) ? row.values.slice(1) : [];

      // Validate fields except for UPC and MAP
      if (!isValidRow(values)) {
        return; // Skip this row
      }

      const insertExcelData: ParseExcelDataProps = {
        inventoryDate: parseDate(values[0]),
        vendorName: parseString(values[1]),
        vendorPartNumber: parseString(values[2]),
        manufacturerPartNumber: parseString(values[3]),
        brandName: parseString(values[4]),
        upc: parseString(values[5]),
        searchKeywords: parseString(values[6]),
        quantity: parseNumber(values[7]),
        price: parseNumber(values[8]),
        shippingPrice: parseNumber(values[9]),
        map: parseNumber(values[10]),
      };

      rows.push(insertExcelData);
    });

    return rows;
  // } catch (error) {
  //   console.error(error);
  //   throw new Error("Error parsing Excel file.");
  // }
};

const expectedColumnNames = [
  "Inventory Date",
  "Vendor Name",
  "Vendor Part Number",
  "Manufacturer Part Number",
  "Brand Name",
  "UPC",
  "Search Keywords",
  "Quantity on Hand",
  "Item Cost",
  "Estimated Shipping Cost",
  "MAP",
];

function isValidColumns(df: Worksheet, expectedColumnNames: string[]): boolean {
  if (df.actualRowCount < 1) return false;

  const actualColumnNames: string[] = [];
  df.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
    actualColumnNames.push(cell.text);
  });

  // Remove empty string entries from the end of the actualColumnNames array
  while (actualColumnNames[actualColumnNames.length - 1] === "") {
    actualColumnNames.pop();
  }

  return (
    actualColumnNames.length === expectedColumnNames.length &&
    actualColumnNames.every(
      (name, index) => name === expectedColumnNames[index],
    )
  );
}

function isValidRow(values: unknown[]): boolean {
  for (let i = 0; i < values.length; i++) {
    // Skip validation for UPC (index 5) and MAP (index 10)
    if (i === 5 || i === 10) continue;
    if (values[i] === null || values[i] === undefined || values[i] === "")
      return false;
  }
  return true;
}

function parseString(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return "";
}

function parseNumber(value: unknown): number {
  const number = Number(value);
  return isNaN(number) ? 0 : number;
}

function parseDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }
  return new Date(0); // Return a default date or handle appropriately
}
