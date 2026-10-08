import AdminEditor from "./AdminEditor";
import "./admin.css";
import "./reviews-admin.css";
import "./schedule-admin.css";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <main className="admin-shell"><AdminEditor/></main>;
}
