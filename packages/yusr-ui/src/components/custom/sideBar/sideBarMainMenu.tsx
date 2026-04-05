import { ChevronLeft } from "lucide-react"; // 1. Changed import to ChevronLeft
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
            if (!item.hasAuth) return null;

            if (item.subItems && item.subItems.length > 0) {
              const authorizedSubItems = item.subItems.filter(
                (sub) => sub.hasAuth,
              );

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
                        {/* 2. Changed to ChevronLeft, mr-auto, and -rotate-90 */}
                        <ChevronLeft className="mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
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
