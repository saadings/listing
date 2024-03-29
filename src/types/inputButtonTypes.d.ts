interface FileUploadInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  onChange: (file: File | null) => void;
  accept?: InputAccept;
}
