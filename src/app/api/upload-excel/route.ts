import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import ExcelJS from "exceljs";
import {
  findExcel,
  insertExcel,
  insertExcelData,
} from "@/utils/database/queries";
import { parseExcel } from "@/utils/excel/parseExcel";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const formData = await req.formData();

    const excel = formData.get("excel") as File;

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

    const existingExcel = await findExcel({
      name: excel.name,
      size: excel.size,
    });

    if (existingExcel) {
      return new Response(
        JSON.stringify({ error: "Excel file already exists" }),
        {
          status: 400,
        },
      );
    }

    const workbook = new ExcelJS.Workbook();
    // Read the Excel file from the buffer
    const df = (await workbook.xlsx.load(await excel.arrayBuffer()))
      .worksheets[0];

    const rows = parseExcel(df);

    const blob = await put(excel.name, excel, {
      access: "public",
    });

    const excelFile = await insertExcel({
      name: excel.name,
      url: blob.url,
      size: excel.size,
      lastModified: new Date(excel.lastModified),
    });

    for (const row of rows) {
      const excelData = await insertExcelData({
        excelId: excelFile.id,
        ...row,
      });

      console.log(excelData);
    }

    return new Response(
      JSON.stringify({
        message: "Excel Parsed Successfully.",
        data: { url: blob.url, name: blob.pathname },
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
}
