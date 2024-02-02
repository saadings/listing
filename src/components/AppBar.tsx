import { DarkModeToggleButton } from "@/components/DarkModeToggleButton";

const AppBar = () => {
  return (
    <div className="flex justify-center border px-12 py-6 shadow-lg shadow-black/10 dark:shadow-white/10">
      <div>
        <DarkModeToggleButton />
      </div>
    </div>
  );
};

export default AppBar;
