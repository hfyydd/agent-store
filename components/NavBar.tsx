// components/NavBar.js
import Image from 'next/image';
import AuthButton from "./AuthButton";
import NavLink from './NavLink';
import { navItems } from '../lib/navConfig';

export default function NavBar() {
  return (
    <nav className="w-full border-b border-b-foreground/10 bg-background">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <NavLink href="/store" enabled={true} label={
            <div className="flex items-center space-x-2">
              <Image src="/images/koala.svg" alt="Logo" width={32} height={32} />
              <span className="font-bold text-xl">考拉编程树屋</span>
            </div>
          } />
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}