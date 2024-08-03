// lib/navConfig.ts
export interface NavItem {
    href: string;
    label: string;
    enabled: boolean;
  }
  
  export const navItems: NavItem[] = [
    { href: '/store', label: '商城', enabled: true },
    { href: '/education', label: '教育', enabled: true },
    { href: '/apps', label: '应用', enabled: false },
    { href: '/efficiency', label: '效率工具', enabled: false },
    { href: '/coding', label: '代码助手', enabled: false },
  ];