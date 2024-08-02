// components/NavLink.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  label: string | ReactNode;
  enabled: boolean;
}

export default function NavLink({ href, label, enabled }: NavLinkProps) {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!enabled) {
      e.preventDefault();
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        router.push('/store');
      }, 2000);
    }
  };

  return (
    <>
      <Link
        href={href}
        onClick={handleClick}
        className={`text-foreground/80 hover:text-foreground ${!enabled && 'opacity-50'}`}
      >
        {label}
      </Link>
      {showAlert && (
        <div className="fixed top-16 left-0 right-0 bg-yellow-500 text-white p-2 text-center z-50">
          该功能暂未开通，即将跳转到商城页面
        </div>
      )}
    </>
  );
}