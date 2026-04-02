import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../pure/sidebar";
export function SideBarMainMenu({
  items,
  LinkComponent = "a",
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
    hasAuth: boolean;
  }[];
  LinkComponent?: React.ElementType;
}) {
  return (
    <SidebarGroup className="mt-5">
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(
            (item) =>
              item.hasAuth && (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <LinkComponent
                      href={item.url}
                      className="flex items-center justify-start gap-3 w-full px-3"
                    >
                      <span className="flex items-center justify-center shrink-0 size-4">
                        {item.icon}
                      </span>

                      <span className="font-medium truncate">{item.title}</span>
                    </LinkComponent>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ),
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
