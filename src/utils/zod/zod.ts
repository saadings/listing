import * as z from "zod";

export const uploadFileFormSchema = z.object({
  excel: z.union([z.instanceof(File), z.null()]),
});

export const searchFormSchema = z.object({
  date: z.object({
    from: z.date(),
    to: z.date(),
  }),
});
