import prisma from "@/utils/prisma/instance";

export const insertExcel = async (
  name: string,
  url: string,
  size: number,
  lastModified: Date,
) => {
  try {
    const excel = await prisma.excel.create({
      data: {
        name,
        url,
        size,
        last_modified: lastModified,
      },
    });

    console.log(excel);
  } catch (error) {
    console.error(error);
    throw new Error("Error inserting excel");
  }
};
