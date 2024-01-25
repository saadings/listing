import * as z from "zod";

export const formSchema = z.object({
  excel: z.union([z.instanceof(File), z.null()]),
});
