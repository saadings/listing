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
            manufacturer_part_number: manufacturerPartNumber?.toLowerCase(),
            brand_name: brandName !== undefined ? brandName?.toLowerCase() : "", // Convert undefined to null for brandName
            upc: upc !== undefined ? upc?.toLowerCase() : "", // Convert undefined to null for upc
          },
          update: {},
          where: {
            manufacturer_part_number_brand_name_upc: {
              manufacturer_part_number: manufacturerPartNumber?.toLowerCase(),
              brand_name:
                brandName !== undefined ? brandName?.toLowerCase() : "", // Convert undefined to null for brandName
              upc: upc !== undefined ? upc?.toLowerCase() : "", // Convert undefined to null for upc
            },
          },
        });

        const inventory = await prisma.inventory.create({
          data: {
            date: inventoryDate,
            vendor_name: vendorName?.toLowerCase(),
            vendor_part_number: vendorPartNumber?.toLowerCase(),
            search_keywords: searchKeywords?.toLowerCase(),
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
        maxWait: 200000, // default: 2000
        timeout: 500000, // default: 5000
      },
    );

    return result;
  } catch (error: any) {
    console.error("Error in transaction:", error);
    throw new Error(`Error inserting excel data: ${error.message}`);
  }
};

export const findCountVendorParts = async () => {
  try {
    const count = await prisma.product.count();

    return count;
  } catch (error) {
    console.error(error);
    throw new Error("Error finding count of vendor parts.");
  }
};

export const findAllVendorParts = async (
  page = 1,
  pageSize = 100,
  manufacturerPartNumber?: string | null,
  brandName?: string | null,
  upc?: string | null,
) => {
  try {
    const skip = (page - 1) * pageSize; // Calculate the offset

    const where: any = {};

    if (manufacturerPartNumber) {
      where.manufacturer_part_number = manufacturerPartNumber;
    }

    if (brandName) {
      where.brand_name = brandName;
    }

    if (upc) {
      where.upc = upc;
    }

    const parts = await prisma.product.findMany({
      skip: skip,
      take: pageSize,
      where: where,
    });

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
  vendorName?: string | null,
  vendorPartNumber?: string | null,
) => {
  try {
    const where: any = {
      date: {
        gte: fromDate,
        lte: toDate,
      },
      product_id: productId,
    };

    if (vendorName) {
      where.vendor_name = vendorName;
    }

    if (vendorPartNumber) {
      where.vendor_part_number = vendorPartNumber;
    }

    const inventory = await prisma.inventory.findMany({
      where: where,
    });

    return inventory;
  } catch (error) {
    console.error(error);
    throw new Error("Error finding data by date range.");
  }
};
