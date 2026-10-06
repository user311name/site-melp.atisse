import AdminEditor from "./AdminEditor";
import "./admin.css";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <main className="admin-shell"><AdminEditor/></main>;
}
