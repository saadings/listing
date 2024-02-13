import { NextRequest, NextResponse } from "next/server";
import {
  findAllVendorParts,
  findDataByDateRangeAndVendorPart,
} from "@/utils/database/queries";
import {
  calculateNegativeVelocityQuantity,
  calculatePositiveVelocityQuantity,
  calculateVelocityPrice,
} from "@/utils/helpers/calculateVelocity";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const { searchParams } = new URL(req.url);

    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const vendorName = searchParams.get("vendorName");
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not specified
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10); // Default page size to 10 if not specified

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

    const vendorParts = await findAllVendorParts(vendorName);

    console.log(vendorParts);

    if (vendorParts.length === 0) {
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

    // Map each vendor part to a promise that resolves to its inventory data
    const inventoryPromises = vendorParts.map((part) =>
      findDataByDateRangeAndVendorPart(fromDate, toDate, part.vendor.id),
    );

    // Wait for all promises to resolve
    const allInventoryData = await Promise.all(inventoryPromises);

    const velocities: ReturnVelocitiesByDateRange[] = [];

    // Process each inventory data set
    allInventoryData.forEach((inventoryData, index) => {
      if (inventoryData.length === 0) {
        return; // Continue to next iteration if no data
      }

      const part = vendorParts[index]; // Get the corresponding part
      const positiveVelocityQuantity =
        calculatePositiveVelocityQuantity(inventoryData);
      const negativeVelocityQuantity =
        calculateNegativeVelocityQuantity(inventoryData);
      const velocityPrice = calculateVelocityPrice(inventoryData);

      velocities.push({
        partNumber: part.part_number,
        vendor: {
          id: part.vendor.id,
          name: part.vendor.name,
        },
        manufacturer: {
          id: part.manufacturer.id,
          partNumber: part.manufacturer.part_number,
        },
        fromDate,
        toDate: toDate,
        positiveVelocityQuantity,
        negativeVelocityQuantity,
        velocityPrice,
      });
    });

    return new Response(
      JSON.stringify({
        message: "Velocity calculated successfully",
        data: {
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
