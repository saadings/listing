"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form as ShadForm,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { entitiesSearchFormSchema } from "@/utils/zod/zod";
import { Input } from "../ui/input";

const EntitiesSearchForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof entitiesSearchFormSchema>>({
    resolver: zodResolver(entitiesSearchFormSchema),
    defaultValues: {
      vendorName: "",
      vendorPartNumber: "",
      manufacturerPartNumber: "",
      brandName: "",
      upc: "",
    },
  });

  const handleSubmit = async (
    values: z.infer<typeof entitiesSearchFormSchema>,
  ) => {
    const newSearchParams = new URLSearchParams({
      from: searchParams.get("from") ?? "",
      to: searchParams.get("to") ?? "",
      vendorName: values.vendorName ?? "",
      vendorPartNumber: values.vendorPartNumber ?? "",
      manufacturerPartNumber: values.manufacturerPartNumber ?? "",
      brandName: values.brandName ?? "",
      upc: values.upc ?? "",
    });

    const url = "/search?page=1&pageSize=100&" + newSearchParams?.toString();

    console.log(url);

    router.push(url);
  };

  return (
    <div>
      <ShadForm {...form}>
        <form
          className="flex flex-row items-center justify-center space-x-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="vendorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a Vendor Name"
                    onChange={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vendorPartNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor Part Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a Vendor Part Number"
                    onChange={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manufacturerPartNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer Part Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a Manufacturer Part Number"
                    onChange={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brandName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a Brand Name"
                    onChange={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="upc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UPC</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a UPC" onChange={field.onChange} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Search</Button>
        </form>
      </ShadForm>
    </div>
  );
};

export default EntitiesSearchForm;
