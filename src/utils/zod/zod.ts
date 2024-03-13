"use client";
import * as z from "zod";

export const uploadFileFormSchema = z.object({
  excel: z.union([z.instanceof(File), z.null()]),
});

export const searchFormSchema = z.object({
  date: z.object({
    from: z.date(),
    to: z.date(),
  }),
  // vendorName: z.string().optional(),
  // vendorPartNumber: z.string().optional(),
  // manufacturerPartNumber: z.string().optional(),
  // brandName: z.string().optional(),
  // upc: z.string().optional(),
});

export const entitiesSearchFormSchema = z.object({
  vendorName: z.string().optional(),
  vendorPartNumber: z.string().optional(),
  manufacturerPartNumber: z.string().optional(),
  brandName: z.string().optional(),
  upc: z.string().optional(),
});
