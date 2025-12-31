'use client';

import dynamic from "next/dynamic";

// Dynamic import ClientLayout to avoid hydration mismatch
const ClientLayout = dynamic(() => import("./client-layout").then(mod => ({ default: mod.ClientLayout })), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
});

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  return <ClientLayout>{children}</ClientLayout>;
}
