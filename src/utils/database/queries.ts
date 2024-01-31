import prisma from "@/utils/prisma/instance";
import { DateRange } from "react-day-picker";

export const findExcel = async ({ name, size }: FindExcelFileProps) => {
  try {
    const excel = await prisma.excel.findUnique({
      where: { name, size },
    });

    return excel;
  } catch (error) {
    console.error(error);
    throw new Error("Error finding excel file.");
  }
};

export const insertExcel = async ({
  name,
  url,
  size,
  lastModified,
}: InsertExcelFileProps) => {
  try {
    const excel = await prisma.excel.upsert({
      where: { name },
      update: {},
      create: {
        name,
        url,
        size,
        last_modified: lastModified,
      },
    });

    return excel;
  } catch (error) {
    console.error(error);
    throw new Error("Error inserting excel file.");
  }
};

export const insertExcelData = async ({
  excelId,
  inventoryDate,
  vendorName,
  vendorPartNumber,
  manufacturerPartNumber,
  brandName,
  upc,
  searchKeywords,
  quantity,
  price,
  shippingPrice,
  map,
}: InsertExcelDataProps) => {
  try {
    const result = await prisma.$transaction(
      async (tx) => {
        // Find or create vendor
        console.log("Creating or updating vendor");
        const vendor = await tx.vendor.upsert({
          where: { name: vendorName },
          update: {},
          create: { name: vendorName },
        });

        console.log("Creating or updating vendor vendor part detail");
        await tx.vendor_part_detail.upsert({
          where: { part_number: vendorPartNumber },
          update: {},
          create: { part_number: vendorPartNumber, vendor_id: vendor.id },
        });

        console.log("Creating or updating manufacturer");
        // Find or create manufacturer
        const manufacturer = await tx.manufacturer.upsert({
          where: { part_number: manufacturerPartNumber },
          update: {},
          create: { part_number: manufacturerPartNumber },
        });

        console.log("Creating or updating brand");
        // Find or create brand
        const brand = await tx.brand.upsert({
          where: { name: brandName },
          update: {},
          create: { name: brandName },
        });

        console.log("Creating or updating product");
        // Find or create product
        await tx.product.upsert({
          where: { search_keywords: searchKeywords },
          update: {},
          create: {
            upc,
            search_keywords: searchKeywords,
            brand_id: brand.id,
          },
        });

        console.log("Creating part detail");
        // Create part_detail
        const partDetail = await tx.part_detail.create({
          data: {
            vendor_id: vendor.id,
            manufacturer_id: manufacturer.id,
            brand_id: brand.id,
          },
        });

        console.log("Creating inventory");
        const inventory = await tx.inventory.create({
          data: {
            date: inventoryDate,
            quantity,
            price,
            shipping_price: shippingPrice,
            map,
            part_detail_id: partDetail.id,
          },
        });

        console.log("Creating or updating excel import");
        // Create entry in excel_import table
        const excelImport = await tx.excel_import.upsert({
          where: { excel_id: excelId },
          update: {},
          create: {
            excel_id: excelId,
            inventory_id: inventory.id,
          },
        });

        return {
          partDetailId: partDetail.id,
          inventoryId: inventory.id,
          excelImportId: excelImport.id,
        };
      },
      {
        maxWait: 5000 * 2, // default: 2000
        timeout: 10000 * 2, // default: 5000
      },
    );

    return result;
  } catch (error: any) {
    console.error("Error in transaction:", error);
    throw new Error(`Error inserting excel data: ${error.message}`);
  }
};

export const findDataByDateRange = async (from: Date, to: Date) => {
  try {
    const data = await prisma.inventory.findMany({
      where: {
        date: {
          gte: from,
          lte: to,
        },
      },
      orderBy: {
        date: "asc",
      },
      // include: {
      //   part_detail: {
      //     include: {
      //       vendor: true,
      //       manufacturer: true,
      //       brand: true,
      //     },
      //   },
      // },
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error finding data by date range.");
  }
};
