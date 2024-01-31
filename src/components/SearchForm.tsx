"use client";
import * as z from "zod";
import { subDays } from "date-fns";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form as ShadForm,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { searchFormSchema } from "@/utils/zod/zod";
import DateRangePicker from "./DateRangePicker";

const SearchForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      date: {
        from: subDays(new Date(), 7),
        to: new Date(),
      },
    },
  });

  const handleSubmit = async (values: z.infer<typeof searchFormSchema>) => {
    const searchParams = new URLSearchParams({
      from: values.date.from.toISOString(),
      to: values.date.to.toISOString(),
    });

    const url = "/search" + "?" + searchParams.toString();

    router.push(url);
  };

  return (
    <div>
      <ShadForm {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Date Range</FormLabel>
                <FormControl>
                  <DateRangePicker
                    date={field.value}
                    setDate={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  {/* This field only accept&apos;s excel files. */}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            Search
            {/* {!uploading ? (
              <>Upload</>
            ) : (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            )} */}
          </Button>
        </form>
      </ShadForm>
    </div>
  );
};

export default SearchForm;