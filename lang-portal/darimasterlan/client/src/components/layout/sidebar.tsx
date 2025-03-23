import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  History,
  Settings,
  GraduationCap
} from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  const menuItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/study", label: "Study Activities", icon: GraduationCap },
    { href: "/vocabulary", label: "Words", icon: BookOpen },
    { href: "/groups", label: "Word Groups", icon: Layers },
    { href: "/sessions", label: "Sessions", icon: History },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="sidebar w-64 min-h-screen p-4 space-y-6">
      <div className="flex items-center space-x-2 px-2 mb-8">
        <span className="text-2xl font-display font-bold">DariMaster</span>
      </div>

      <nav className="space-y-2">
        {menuItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <a className={cn(
              "sidebar-item",
              location === href && "active"
            )}>
              <Icon className="w-5 h-5 mr-3" />
              <span>{label}</span>
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );
}
