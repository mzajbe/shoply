import { redirect } from "next/navigation";

export default function DashboardThemeRedirect() {
  redirect("/dashboard/v1/theme");
}

