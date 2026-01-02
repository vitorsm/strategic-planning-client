
export type NavItemType = {
    icon: string;
    label: string;
    href: string;
    active?: boolean;
};

export type SidebarProps = {
    userName: string;
    userRole: string;
    userAvatar?: string;
    navItems: NavItemType[];
    onSignOut?: () => void;
};
