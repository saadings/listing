import FileUploadForm from "@/components/FileUploadForm";
import SearchForm from "@/components/SearchForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-52 p-24">
      <FileUploadForm />
      <SearchForm />
    </main>
  );
}
