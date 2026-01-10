import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Users, ShoppingBag, User, LogOut, Sparkles, BarChart3, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import NotificationCenter from "@/components/NotificationCenter";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Content Creation", href: "/dashboard/content", icon: Sparkles },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "Community", href: "/dashboard/community", icon: Users },
  { name: "Resources", href: "/resources/templates", icon: FolderOpen },
  { name: "Products", href: "/products/all", icon: ShoppingBag },
  { name: "Profile", href: "/dashboard/profile", icon: User }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-all group">
            <div className="flex items-center justify-center p-1.5 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm border border-border/50 group-hover:shadow-md group-hover:border-primary/20 transition-all">
              <img 
                src="/assets/logo.png" 
                alt="ContentAnonymity.com" 
                className="h-9 w-auto object-contain max-w-[220px] drop-shadow-sm"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <Link to="/dashboard/profile">
              <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 ring-primary transition-all">
                <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
              </Avatar>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
