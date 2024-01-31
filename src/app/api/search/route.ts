import { findDataByDateRange } from "@/utils/database/queries";
import {
  calculateNegativeVelocity,
  calculatePositiveVelocity,
} from "@/utils/helpers/calculateVelocity";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const { searchParams } = new URL(req.url);

    const from = searchParams.get("from");
    const to = searchParams.get("to");

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

    const inventoryData = await findDataByDateRange(fromDate, toDate);

    const positiveVelocity = calculatePositiveVelocity(inventoryData);
    const negativeVelocity = calculateNegativeVelocity(inventoryData);

    return new Response(
      JSON.stringify({
        message: "Velocity calculated successfully",
        data: {
          positiveVelocity,
          negativeVelocity,
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
