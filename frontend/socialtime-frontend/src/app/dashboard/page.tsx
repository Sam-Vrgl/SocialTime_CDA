// src/pages/dashboard.tsx
import RequireAuth from '@/components/RequireAuth';


export default function Dashboard() {
  return (
    <RequireAuth>
      <h1>Welcome to your dashboard!</h1>
      {/* fetch protected data here */}
    </RequireAuth>
  );
}
