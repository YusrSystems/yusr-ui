import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../../pure/sidebar";
// Make sure to import Collapsible from your UI library (usually Radix UI / Shadcn)
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../pure/collapsible";

export type MainMenuItem = {
  title: string;
  url: string;
  icon?: React.ReactNode;
  hasAuth: boolean;
  subItems?: {
    title: string;
    url: string;
    hasAuth: boolean;
  }[];
};

export function SideBarMainMenu({ items }: { items: MainMenuItem[] }) {
  return (
    <SidebarGroup className="mt-5">
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            // 1. If parent has no auth, hide completely
            if (!item.hasAuth) return null;

            // 2. If item has subItems, render as Collapsible Dropdown
            if (item.subItems && item.subItems.length > 0) {
              const authorizedSubItems = item.subItems.filter(
                (sub) => sub.hasAuth,
              );

              // Hide parent if all children are unauthorized
              if (authorizedSubItems.length === 0) return null;

              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={false}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="w-full justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center shrink-0 size-4">
                            {item.icon}
                          </span>
                          <span className="font-medium truncate">
                            {item.title}
                          </span>
                        </div>
                        {/* Rotate arrow when open. Note: If you use RTL, you might want to adjust the rotation */}
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {authorizedSubItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link to={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            // 3. Render normal single item
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link
                    to={item.url}
                    className="flex items-center justify-start gap-3 w-full px-3"
                  >
                    <span className="flex items-center justify-center shrink-0 size-4">
                      {item.icon}
                    </span>
                    <span className="font-medium truncate">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
