import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Navbar() {
  return (
    <nav className="flex items-center gap-4 border-b bg-white px-4 py-3 shadow-sm">
      <SidebarTrigger />
      <h3 className="text-lg font-semibold">Biblioteca</h3>
    </nav>
  );
}
