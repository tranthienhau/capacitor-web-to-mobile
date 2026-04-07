import { DashboardScreen } from './features/dashboard/DashboardScreen';

export function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
      <h1>Capacitor POC</h1>
      <DashboardScreen />
    </div>
  );
}
