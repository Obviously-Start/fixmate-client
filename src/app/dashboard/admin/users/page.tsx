"use client";
import { toast } from "sonner";
import PageLoader from "@/components/page-loader";
import UserAvatar from "@/components/user-avatar";
import { selectClass } from "@/components/field";
import PageHeader from "@/components/dashboard/page-header";
import { TD, TH, THead, TableWrap } from "@/components/dashboard/table-ui";
import { apiFetch, useFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { formatDate } from "@/lib/format";
import type { AppUser } from "@/lib/types";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const { data, loading, reload } = useFetch<AppUser[]>("/api/admin/users");

  async function changeRole(id: string, role: string) {
    try {
      const res = await apiFetch<{ message: string }>(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      toast.success(res.message);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change role");
    }
  }

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Manage Users" subtitle="View all users and change their roles." />
      <TableWrap>
        <THead>
          <th className={TH}>User</th>
          <th className={TH}>Email</th>
          <th className={TH}>Role</th>
          <th className={TH}>Joined</th>
        </THead>
        <tbody className="divide-y">
          {(data ?? []).map((u) => {
            const isSelf = u.email === session?.user.email;
            return (
              <tr key={u._id}>
                <td className={TD}>
                  <div className="flex items-center gap-3">
                    <UserAvatar name={u.name} image={u.image} className="h-9 w-9" />
                    <span className="font-medium text-slate-900">{u.name}</span>
                  </div>
                </td>
                <td className={TD}>{u.email}</td>
                <td className={TD}>
                  <select
                    className={`${selectClass} w-36`}
                    value={u.role || "customer"}
                    disabled={isSelf}
                    title={isSelf ? "You cannot change your own role" : ""}
                    onChange={(e) => changeRole(u._id, e.target.value)}
                  >
                    <option value="customer">Customer</option>
                    <option value="technician">Technician</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className={`${TD} whitespace-nowrap`}>{formatDate(u.createdAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </TableWrap>
    </div>
  );
}