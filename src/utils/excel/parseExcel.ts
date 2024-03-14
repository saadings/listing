import { Worksheet } from "exceljs";

export const parseExcel = (df: Worksheet): ParseExcelDataProps[] => {
  const rows: ParseExcelDataProps[] = [];

  const validity = isValidColumns(df, expectedColumnNames);

  if (validity.length > 0) {
    throw new Error(validity);
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

function isValidColumns(df: Worksheet, expectedColumnNames: string[]): string {
  if (df.actualRowCount < 1) return "Invalid Excel Columns Length.";

  const actualColumnNames: string[] = [];
  df.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
    actualColumnNames.push(cell.text);
  });

  // Remove empty string entries from the end of the actualColumnNames array
  while (actualColumnNames[actualColumnNames.length - 1] === "") {
    actualColumnNames.pop();
  }

  if (actualColumnNames.length !== expectedColumnNames.length) {
    return "Invalid Excel Columns Length.";
  }

  for (let i = 0; i < expectedColumnNames.length; i++) {
    if (actualColumnNames[i] !== expectedColumnNames[i]) {
      return `Invalid Excel Column Name: ${actualColumnNames[i]} at index ${i}. Expected: ${expectedColumnNames[i]} at index ${i}. Column name may contain leading or trailing spaces.`;
    }
  }

  return "";
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
