'use client';

import { usePathname } from 'next/navigation';
import { ClientLayout } from '../client-layout';
import AdminLayout from './AdminLayout';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if this is an admin route
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <ClientLayout>
      {isAdminRoute ? (
        <AdminLayout>
          {children}
        </AdminLayout>
      ) : (
        children
      )}
    </ClientLayout>
  );
}

