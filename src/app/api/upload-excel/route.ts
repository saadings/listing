import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import { formSchema } from "@/utils/zod";
import * as z from "zod";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // const form = new formidable.IncomingForm();

    const formData = await req.formData();

    console.log(formData.get("excel"));

    // form.parse(req, (err, fields, files) => {
    //   // if (err) {
    //   //   res.status(500).json({ error: "Error parsing the files" });
    //   //   return;
    //   // }
    //   // Process your file here
    //   // res.status(200).json({ message: "File uploaded successfully" });
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
