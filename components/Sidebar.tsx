"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const menuStructure = [
    {
      id: 1,
      title: '账户信息',
      items: [
        { id: 'basic', name: '基本信息', path: '/dashboard/basic' },
        { id: 'verify', name: '实名认证', path: '/dashboard/verify' },
        { id: 'apikey', name: 'API Key 管理', path: '/dashboard/apikey' },
        { id: 'usage', name: '用量限制', path: '/dashboard/usage' },
      ]
    },
    {
      id: 2,
      title: '资源管理',
      items: [
        { id: 'workflow', name: 'Workflow', path: '/dashboard/workflow' },
      ]
    },
    {
      id: 3,
      title: '充值信息',
      items: [
        { id: 'overview', name: '账户总览', path: '/dashboard/overview' },
        { id: 'recharge', name: '账户充值', path: '/dashboard/recharge' },
        { id: 'history', name: '充值明细', path: '/dashboard/history' },
        { id: 'billing', name: '计费明细', path: '/dashboard/billing' },
        { id: 'invoice', name: '发票管理', path: '/dashboard/invoice' },
        { id: 'coupon', name: '代金券管理', path: '/dashboard/coupon' },
      ]
    }
  ];

  return (
    <div className="w-64 bg-gray-100 min-h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="py-4">
        {menuStructure.map((section) => (
          <div key={section.id} className="mb-4">
            <div className="px-6 py-2 text-sm font-semibold text-gray-500">
              {section.title}
            </div>
            {section.items.map((item) => (
              <Link 
                key={item.id} 
                href={item.path}
                className={`block px-6 py-2 cursor-pointer transition-colors duration-200 ${
                  pathname === item.path
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-200'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;