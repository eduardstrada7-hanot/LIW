import AdminClient from "./AdminClient";

export const metadata = {
  title: "LIW Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
