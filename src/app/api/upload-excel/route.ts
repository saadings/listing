import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    console.log(await req.json());

    return new Response(JSON.stringify({ message: "Hello world" }), {
      status: 200,
    });
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
}
