import { LogOutIcon } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../../pure/sidebar";
import { ThemeToggle } from "../theme/themeToggle";

export interface SideBarSecondaryMenuProps extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  items: {
    title: string;
    url: string;
    icon: React.ReactNode;
  }[];
  onLogout: () => void;
}

export function SideBarSecondaryMenu({ items, onLogout, ...props }: SideBarSecondaryMenuProps)
{
  return (
    <SidebarGroup { ...props }>
      <SidebarGroupContent>
        <SidebarMenu>
          { items.map((item) => (
            <SidebarMenuItem key={ item.title }>
              <SidebarMenuButton asChild>
                <Link to={ item.url } className="flex items-center justify-start gap-3 w-full px-3">
                  <span className="flex items-center justify-center shrink-0 size-4">{ item.icon }</span>

                  <span className="font-medium truncate">{ item.title }</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )) }

          <SidebarMenuItem>
            <ThemeToggle variant="sidebar" />
          </SidebarMenuItem>

          <SidebarMenuItem key="logout">
            <SidebarMenuButton asChild onClick={ onLogout }>
              <div className="flex items-center justify-start gap-3 w-full px-3 text-destructive cursor-pointer">
                <span className="flex items-center justify-center shrink-0 size-4">
                  <LogOutIcon />
                </span>
                <span className="font-medium truncate">تسجيل الخروج</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
