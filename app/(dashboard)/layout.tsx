import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current";
import { DashboardShell } from "./_components/shell";
import { getUnreadSummary } from "@/lib/notifications/unread";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const unread = await getUnreadSummary({ id: user.id, role: user.role });

  return (
    <DashboardShell
      user={{ alias: user.alias, role: user.role }}
      unread={unread}
    >
      {children}
    </DashboardShell>
  );
}
