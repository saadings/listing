import { NextRequest, NextResponse } from "next/server";
import {
  findAllVendorParts,
  findCountVendorParts,
  findInventoryByDateRange,
} from "@/utils/services/database/queries";
import {
  calculateNegativeVelocityQuantity,
  calculatePositiveVelocityQuantity,
  calculateVelocityPrice,
} from "@/utils/helpers/calculateVelocity";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const { searchParams } = new URL(req.url);

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const vendorName = searchParams.get("vendorName")?.toLowerCase();
    const vendorPartNumber = searchParams
      .get("vendorPartNumber")
      ?.toLowerCase();
    const manufacturerPartNumber = searchParams
      .get("manufacturerPartNumber")
      ?.toLowerCase();
    const brandName = searchParams.get("brandName")?.toLowerCase();
    const upc = searchParams.get("upc")?.toLowerCase();

    // Parse the page and pageSize from the query parameters, with default values
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not specified

    // Parse the pageSize and ensure it does not exceed 100
    let pageSize = parseInt(searchParams.get("pageSize") || "100", 10); // Default page size to 100 if not specified
    pageSize = Math.min(pageSize, 100); // Ensure pageSize does not exceed 100

    if (!from || !to) {
      return new Response(
        JSON.stringify({ error: "Missing required query parameters" }),
        {
          status: 400,
        },
      );
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (fromDate > toDate || toDate < fromDate) {
      return new Response(JSON.stringify({ error: "Invalid date structure" }), {
        status: 400,
      });
    }

    const products = await findAllVendorParts(
      page,
      pageSize,
      manufacturerPartNumber,
      brandName,
      upc,
    );

    if (products.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No vendor parts found",
          data: {
            velocities: [],
          },
        }),
        {
          status: 200,
        },
      );
    }

    // Map each vendor product to a promise that resolves to its inventory data
    const inventoryPromises = products.map((product) =>
      findInventoryByDateRange(
        fromDate,
        toDate,
        product.id,
        vendorName,
        vendorPartNumber,
      ),
    );

    // Wait for all promises to resolve
    const allInventoryData = await Promise.all(inventoryPromises);

    const velocities: any = [];

    // Process each inventory data set
    allInventoryData.forEach((inventoryData, index) => {
      if (inventoryData.length === 0) {
        return; // Continue to next iteration if no data
      }

      const part = products[index]; // Get the corresponding part
      const positiveVelocityQuantity =
        calculatePositiveVelocityQuantity(inventoryData);
      const negativeVelocityQuantity =
        calculateNegativeVelocityQuantity(inventoryData);
      const velocityPrice = calculateVelocityPrice(inventoryData);

      velocities.push({
        partNumber: inventoryData[0].vendor_part_number,
        brand: {
          id: part.id,
          name: part.brand_name,
        },
        vendor: {
          id: part.id,
          name: inventoryData[0].vendor_name,
        },
        manufacturer: {
          id: part.id,
          partNumber: part.manufacturer_part_number,
        },
        fromDate,
        toDate,
        positiveVelocityQuantity,
        negativeVelocityQuantity,
        velocityPrice,
      });
    });

    const countTotalProducts = await findCountVendorParts();

    return new Response(
      JSON.stringify({
        message: "Velocity calculated successfully",
        data: {
          totalPages: Math.ceil(countTotalProducts / pageSize),
          velocities,
        },
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    } else {
      // Handle the case where error is not an instance of Error
      console.error("An unexpected error occurred");
      return new Response(
        JSON.stringify({ error: "An unexpected error occurred" }),
        {
          status: 500,
        },
      );
    }
  }
};
