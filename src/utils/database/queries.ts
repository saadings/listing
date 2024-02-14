import prisma from "@/utils/prisma/instance";

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
        const product = await prisma.product.upsert({
          create: {
            manufacturer_part_number: manufacturerPartNumber,
            brand_name: brandName !== undefined ? brandName : "", // Convert undefined to null for brandName
            upc: upc !== undefined ? upc : "", // Convert undefined to null for upc
          },
          update: {},
          where: {
            manufacturer_part_number_brand_name_upc: {
              manufacturer_part_number: manufacturerPartNumber,
              brand_name: brandName !== undefined ? brandName : "", // Convert undefined to null for brandName
              upc: upc !== undefined ? upc : "", // Convert undefined to null for upc
            },
          },
        });

        const inventory = await prisma.inventory.create({
          data: {
            date: inventoryDate,
            vendor_name: vendorName,
            vendor_part_number: vendorPartNumber,
            search_keywords: searchKeywords,
            quantity,
            price,
            shipping_price: shippingPrice,
            map,
            product_id: product.id,
          },
        });

        return {
          inventoryId: inventory.id,
          productId: product.id,
        };
      },
      {
        maxWait: 10000, // default: 2000
        timeout: 20000, // default: 5000
      },
    );

    return result;
  } catch (error: any) {
    console.error("Error in transaction:", error);
    throw new Error(`Error inserting excel data: ${error.message}`);
  }
};

export const findAllVendorParts = async (vendorName: string | null) => {
  try {
    // Initialize the where clause without specifying vendor name
    // const where: Prisma.vendor_part_detailWhereInput = {};

    // Conditionally add vendor name to the where clause if it is provided
    // if (vendorName) {
    //   where.vendor = { name: vendorName.toLowerCase() };
    // }

    const parts = await prisma.product.findMany({ take: 10 });

    return parts;
  } catch (error) {
    console.error(error);
    throw new Error("Error finding all vendor parts.");
  }
};

export const findInventoryByDateRange = async (
  fromDate: Date,
  toDate: Date,
  productId: string,
) => {
  try {
    const inventory = await prisma.inventory.findMany({
      where: {
        date: {
          gte: fromDate,
          lte: toDate,
        },
        product_id: productId,
      },
    });

    return inventory;
  } catch (error) {
    console.error(error);
    throw new Error("Error finding data by date range.");
  }
};
