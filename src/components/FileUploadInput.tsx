import React from "react";
import { Input } from "@/components/ui/input";

export enum InputAccept {
  EXCEL = ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({
  id,
  accept,
  onChange,
  ...inputProps
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    onChange(file);
  };

  return (
    <div className="w-full items-center justify-center">
      <Input
        aria-label="Upload file"
        id={id}
        type="file"
        accept={accept}
        className="cursor-pointer hover:bg-accent"
        onChange={handleFileChange}
        {...inputProps}
      />
    </div>
  );
};

export default FileUploadInput;
