import { NavLink, useLocation } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  UserCheck, 
  Dumbbell, 
  CreditCard, 
  BarChart3, 
  Settings,
  Home,
  Clock,
  FileText
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Members", url: "/members", icon: Users },
  { title: "Attendance", url: "/attendance", icon: UserCheck },
  { title: "Staff & Trainers", url: "/staff", icon: Calendar },
];

const managementItems = [
  { title: "Workout Plans", url: "/workouts", icon: Dumbbell },
  { title: "Billing", url: "/billing", icon: CreditCard },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getNavClass = (path: string) => {
    const baseClass = "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200";
    return isActive(path)
      ? `${baseClass} bg-sidebar-primary text-sidebar-primary-foreground shadow-medium`
      : `${baseClass} text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`;
  };

  return (
    <Sidebar 
      className={`border-r border-sidebar-border bg-sidebar-background transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
      <SidebarContent className="p-4">
        {/* Logo Section */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-accent">
            <Dumbbell className="h-6 w-6 text-accent-foreground" />
          </div>
          {!isCollapsed && (
            <div className="animate-slide-in">
              <h1 className="text-lg font-bold text-sidebar-foreground">GymPro</h1>
              <p className="text-xs text-sidebar-foreground/70">Management System</p>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/60 mb-2">
              Main
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="animate-slide-in font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Section */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/60 mb-2 mt-6">
              Management
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="animate-slide-in font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats (when expanded) */}
        {!isCollapsed && (
          <div className="mt-auto pt-6">
            <div className="rounded-lg bg-sidebar-accent/50 p-3">
              <div className="flex items-center gap-2 text-sidebar-foreground/80">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Active Members</span>
              </div>
              <p className="text-xl font-bold text-sidebar-foreground mt-1">248</p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}