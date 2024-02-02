import FileUploadForm from "@/components/forms/FileUploadForm";
import SearchForm from "@/components/forms/SearchForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="space-y-10 rounded-lg border border-white/15 p-36 shadow-2xl shadow-white/30">
        <FileUploadForm />
        <SearchForm />
      </div>
    </main>
  );
}
