import prisma from "@/utils/prisma/instance";
import { Prisma } from "@prisma/client";

export const findExcel = async ({ name, size }: FindExcelFileProps) => {
  try {
    const excel = await prisma.excel.findUnique({
      where: { name: name.toLowerCase(), size },
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
      where: { name: name.toLowerCase() },
      update: {},
      create: {
        name: name.toLowerCase(),
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
      async (prisma) => {
        // Find or create vendor
        console.log("Creating or updating vendor");
        const vendor = await prisma.vendor.upsert({
          where: { name: vendorName.toLowerCase() },
          update: {},
          create: { name: vendorName.toLowerCase() },
        });

        console.log("Creating or updating vendor vendor part detail");
        const part = await prisma.vendor_part_detail.findFirst({
          where: {
            vendor_id: vendor.id,
            part_number: vendorPartNumber.toLowerCase(),
          },
        });

        console.log("Creating or updating manufacturer");
        // Find or create manufacturer
        const manufacturer = await prisma.manufacturer.upsert({
          where: { part_number: manufacturerPartNumber.toLowerCase() },
          update: {},
          create: { part_number: manufacturerPartNumber.toLowerCase() },
        });

        if (!part) {
          await prisma.vendor_part_detail.create({
            data: {
              part_number: vendorPartNumber.toLowerCase(),
              vendor_id: vendor.id,
              manufacturer_id: manufacturer.id,
            },
          });
        }

        console.log("Creating or updating brand");
        // Find or create brand
        const brand = await prisma.brand.upsert({
          where: { name: brandName.toLowerCase() },
          update: {},
          create: { name: brandName.toLowerCase() },
        });

        console.log("Creating or updating product");
        const product = await prisma.product.findFirst({
          where: {
            search_keywords: searchKeywords.toLowerCase(),
            upc: upc?.toLowerCase(),
            map,
            brand_id: brand.id,
          },
        });

        if (!product) {
          await prisma.product.create({
            data: {
              upc: upc?.toLowerCase(),
              search_keywords: searchKeywords.toLowerCase(),
              brand_id: brand.id,
            },
          });
        }

        console.log("Creating part detail");
        // Create part_detail
        const partDetail = await prisma.part_detail.create({
          data: {
            vendor_id: vendor.id,
            brand_id: brand.id,
          },
        });

        console.log("Creating inventory");
        const inventory = await prisma.inventory.create({
          data: {
            date: inventoryDate,
            quantity,
            price,
            shipping_price: shippingPrice,
            part_detail_id: partDetail.id,
          },
        });

        console.log("Creating or updating excel import");
        // Create entry in excel_import table
        const excelImport = await prisma.excel_import.upsert({
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
        maxWait: 10000, // default: 2000
        timeout: 20000, // default: 5000
      },
    );

    return result;

    // return {
    //   partDetailId: partDetail.id,
    //   inventoryId: inventory.id,
    //   excelImportId: excelImport.id,
    // };
  } catch (error: any) {
    console.error("Error in transaction:", error);
    throw new Error(`Error inserting excel data: ${error.message}`);
  }
};

export const findAllVendorParts = async (vendorName: string | null) => {
  try {
    // Initialize the where clause without specifying vendor name
    const where: Prisma.vendor_part_detailWhereInput = {};

    // Conditionally add vendor name to the where clause if it is provided
    if (vendorName) {
      where.vendor = { name: vendorName.toLowerCase() };
    }

    const vendorParts = await prisma.vendor_part_detail.findMany({
      take: 100,
      select: {
        part_number: true,
        vendor: true,
        manufacturer: true,
      },
      where: where,
    });

    return vendorParts;
  } catch (error) {
    console.error(error);
    throw new Error("Error finding all vendor parts.");
  }
};

export const findDataByDateRangeAndVendorPart = async (
  fromDate: Date,
  toDate: Date,
  vendorId: string,
) => {
  try {
    const partDetails = await prisma.part_detail.findMany({
      take: 100,
      where: {
        vendor_id: vendorId,
      },
      include: {
        inventory: {
          where: {
            date: {
              gte: fromDate,
              lte: toDate,
            },
          },
        },
      },
    });

    return partDetails.flatMap((partDetail) => partDetail.inventory);
  } catch (error) {
    console.error(error);
    throw new Error("Error finding data by date range.");
  }
};
