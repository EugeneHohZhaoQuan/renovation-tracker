// app/dashboard/layout.tsx
import { Header } from '@/components/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-off-white">
      <Header />
      <main>{children}</main>
    </div>
  );
}
