import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Utensils, 
  MessageSquare, 
  Bell, 
  UserCircle, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/meals", label: "Meal Log", icon: Utensils },
  { href: "/coach", label: "AI Coach", icon: MessageSquare },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed h-full z-20">
        <div className="p-8">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            NutriKenya
          </h1>
          <p className="text-xs text-muted-foreground mt-1 tracking-wide uppercase font-medium">Wellness AI</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                  isActive 
                    ? "bg-primary/10 text-primary font-semibold shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}>
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600")} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">NutriKenya</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-0 bg-white z-40 pt-20 px-4"
          >
            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium",
                      location === item.href ? "bg-primary/10 text-primary" : "text-gray-600"
                    )}
                  >
                    <item.icon className="w-6 h-6" />
                    {item.label}
                  </div>
                </Link>
              ))}
              <button 
                onClick={() => logout()}
                className="flex items-center gap-4 px-4 py-4 w-full rounded-xl text-lg font-medium text-red-500 bg-red-50 mt-8"
              >
                <LogOut className="w-6 h-6" />
                Sign Out
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 min-h-screen pt-16 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
