import { usePathname } from 'next/navigation';

import {BookMarked, Home, Layers, Settings, User } from 'lucide-react';

export const NavItems = () => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      name: 'Task',
      href: '/tasks',
      icon: <Home size={20} />,
      active: pathname === '/tasks',
      position: 'top',
    },
    {
      name: 'History',
      href: '/history',
      icon: <BookMarked size={20} />,
      active: isNavItemActive(pathname, '/history'),
      position: 'top',
    },

    {
      name: 'Profile',
      href: '/profile',
      icon: <User size={20} />,
      active: isNavItemActive(pathname, '/profile'),
      position: 'top',
    },

  ];
};