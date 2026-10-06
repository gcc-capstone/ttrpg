import { Navigate } from "react-router-dom";
import { useGlobalStore } from "./GlobalStore";

export default function RequireLobby({ children }: { children: JSX.Element }) {
  const { selectedHost } = useGlobalStore();

  if (!selectedHost) {
    return <Navigate to="/lobby" replace />;
  }

  return children;
}
