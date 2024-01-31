"use client";
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import FileUploadInput, { InputAccept } from "./FileUploadInput";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

import { uploadFileFormSchema } from "@/utils/zod/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const FileUploadForm = () => {
  const form = useForm<z.infer<typeof uploadFileFormSchema>>({
    resolver: zodResolver(uploadFileFormSchema),
    defaultValues: {
      excel: null,
    },
  });

  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (values: z.infer<typeof uploadFileFormSchema>) => {
    if (!values?.excel) return;

    const formData = new FormData();
    formData.append("excel", values.excel);

    setUploading(true);
    try {
      const response = await fetch("/api/upload-excel", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(`${error}`);
      }

      const result = await response.json();
      console.log(result);

      toast({
        title: "File Uploaded Successfully!",
        description: result.message,
        action: (
          <ToastAction altText="Download Excel">
            <Link href={result.data.url}>Download Excel</Link>
          </ToastAction>
        ),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.\n" + error.message,
        action: (
          <ToastAction
            altText="Try again"
            onClick={form.handleSubmit(handleSubmit)}
          >
            Try again
          </ToastAction>
        ),
      });
      console.error("File upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <ShadForm {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
          encType="multipart/form-data"
        >
          <FormField
            control={form.control}
            name="excel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload File</FormLabel>
                <FormControl>
                  <FileUploadInput
                    id="excel"
                    accept={InputAccept.EXCEL}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  This field only accept&apos;s excel files.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={uploading}>
            {!uploading ? (
              <>Upload</>
            ) : (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            )}
          </Button>
        </form>
      </ShadForm>
      <Toaster />
    </div>
  );
};

export default FileUploadForm;
