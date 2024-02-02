import prisma from "@/utils/prisma/instance";

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
        const part = await tx.vendor_part_detail.findFirst({
          where: { vendor_id: vendor.id, part_number: vendorPartNumber },
        });

        console.log("Creating or updating manufacturer");
        // Find or create manufacturer
        const manufacturer = await tx.manufacturer.upsert({
          where: { part_number: manufacturerPartNumber },
          update: {},
          create: { part_number: manufacturerPartNumber },
        });

        if (!part) {
          await tx.vendor_part_detail.create({
            data: {
              part_number: vendorPartNumber,
              vendor_id: vendor.id,
              manufacturer_id: manufacturer.id,
            },
          });
        }

        console.log("Creating or updating brand");
        // Find or create brand
        const brand = await tx.brand.upsert({
          where: { name: brandName },
          update: {},
          create: { name: brandName },
        });

        console.log("Creating or updating product");
        const product = await tx.product.findFirst({
          where: {
            search_keywords: searchKeywords,
            upc,
            map,
            brand_id: brand.id,
          },
        });

        if (!product) {
          await tx.product.create({
            data: {
              upc,
              search_keywords: searchKeywords,
              brand_id: brand.id,
            },
          });
        }

        console.log("Creating part detail");
        // Create part_detail
        const partDetail = await tx.part_detail.create({
          data: {
            vendor_id: vendor.id,
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

export const findAllVendorParts = async () => {
  try {
    const vendorParts = await prisma.vendor_part_detail.findMany({
      select: {
        part_number: true,
        vendor: true,
        manufacturer: true,
      },
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
