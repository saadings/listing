import FileUploadForm from "@/components/forms/FileUploadForm";
import SearchForm from "@/components/forms/SearchForm";

export default function Home() {
  return (
    <main className="flex min-h-[91vh] select-none flex-col items-center justify-center">
      <div className="space-y-12 rounded-lg border p-24 shadow-2xl shadow-black/30 dark:border-white/15 dark:shadow-white/30">
        <FileUploadForm />
        <SearchForm />
      </div>
    </main>
  );
}
