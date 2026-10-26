import { redirect } from "react-router";

import { api } from "../api.js";

export async function clientLoader() {
  return redirect("/admin");
}

export async function clientAction() {
  await api("/logout", { method: "POST" }).catch(() => {});
  return redirect("/admin/login");
}

export default function Logout() {
  return null;
}
