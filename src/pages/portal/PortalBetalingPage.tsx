import { Navigate } from "react-router-dom";

/** Betaling zit in facturatie */
export default function PortalBetalingPage() {
  return <Navigate to="/portal/facturatie?tab=facturatie#openstaand" replace />;
}
