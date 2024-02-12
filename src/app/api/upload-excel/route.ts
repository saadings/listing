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
      await insertExcelData({
        excelId: excelFile.id,
        ...row,
      });
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

// import { NextRequest, NextResponse } from "next/server";
// import { put } from "@vercel/blob";
// import ExcelJS from "exceljs";
// import {
//   findExcel,
//   insertExcel,
//   insertExcelData,
// } from "@/utils/database/queries";
// import { parseExcel } from "@/utils/excel/parseExcel";

// export async function POST(req: NextRequest, res: NextResponse) {
//   try {
//     const formData = await req.formData();
//     const excel = formData.get("excel") as File;

//     if (!excel || excel.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
//       return new Response(JSON.stringify({ error: "Uploaded file is not a valid Excel file" }), { status: 400 });
//     }

//     const existingExcel = await findExcel({ name: excel.name, size: excel.size });
//     if (existingExcel) {
//       return new Response(JSON.stringify({ error: "Excel file already exists" }), { status: 400 });
//     }

//     const workbook = new ExcelJS.Workbook();
//     const df = (await workbook.xlsx.load(await excel.arrayBuffer())).worksheets[0];
//     const rows = parseExcel(df);

//     const blob = await put(excel.name, excel, { access: "public" });

//     // Insert the Excel metadata into the database immediately
//     const excelFile = await insertExcel({
//       name: excel.name,
//       url: blob.url,
//       size: excel.size,
//       lastModified: new Date(excel.lastModified),
//     });

//     // Immediately respond after saving the file to the cloud
//     res(new Response(JSON.stringify({
//       message: "File upload initiated.",
//       data: { url: blob.url, name: blob.pathname },
//     }), { status: 202 })); // Using 202 Accepted to indicate the request has been accepted for processing, but the processing has not been completed.

//     // Start parsing and database update without awaiting its completion
//     rows.forEach(async (row) => {
//       await insertExcelData({
//         excelId: excelFile.id,
//         ...row,
//       });
//     }).catch(error => console.error("Error processing Excel data:", error));

//     // Since we're not waiting for the parsing to complete, there's no further response to the client here
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "An unexpected error occurred" }), {
//       status: 500,
//     });
//   }
// }
