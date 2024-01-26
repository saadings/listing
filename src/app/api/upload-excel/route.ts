import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import ExcelJS from "exceljs";
import { insertExcel } from "@/utils/database/queries";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const formData = await req.formData();

    const excel = formData.get("excel") as File;

    console.log(excel);

    if (
      !excel ||
      excel.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return new Response(
        JSON.stringify({ error: "Uploaded file is not a valid Excel file" }),
        {
          status: 400,
        },
      );
    }

    const blob = await put(excel.name, excel, {
      access: "public",
    });

    // console.log(blob);

    await insertExcel(
      excel.name,
      blob.url,
      excel.size,
      new Date(excel.lastModified),
    );

    const workbook = new ExcelJS.Workbook();
    // Read the Excel file from the buffer
    const df = (await workbook.xlsx.load(await excel.arrayBuffer()))
      .worksheets[0];

    // df.eachRow((row, rowNumber) => {
    //   console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
    // });

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
