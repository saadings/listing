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
import FileUploadButton, { InputAccept } from "./FileUploadButton";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

import { formSchema } from "@/utils/zod";
import { ReloadIcon } from "@radix-ui/react-icons";

const Form = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      excel: null,
    },
  });

  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);

      toast({
        title: "Success!",
        description: "Your file has been uploaded.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
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
                  <FileUploadButton
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

export default Form;
