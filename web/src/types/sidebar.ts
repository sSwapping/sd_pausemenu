export interface NavItem {
  label: string;
  icon?: React.ReactNode;
  action?: string;
}

export interface SidebarProps {
  navItems: NavItem[];
  activeIndex: number;
  onAction: (action: string) => void;
  onHover: (index: number) => void;
}
