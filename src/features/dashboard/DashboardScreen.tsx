import { useEffect } from 'react';

import { nativeBridge } from '../../services/nativeBridge';
import { useInspectionStore } from './inspectionStore';

export function DashboardScreen() {
  const inspections = useInspectionStore((s) => s.inspections);
  const capture = useInspectionStore((s) => s.capture);
  const load = useInspectionStore((s) => s.load);

  useEffect(() => {
    void load();
    void nativeBridge.registerForPush((token) => {
      console.log('Push token registered:', token);
    });
  }, [load]);

  return (
    <div>
      <h2>Field inspections</h2>
      <button
        type="button"
        onClick={() => void capture()}
        style={{
          padding: '12px 24px',
          background: '#0ea5e9',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          cursor: 'pointer',
        }}>
        Capture inspection
      </button>

      <ul style={{ marginTop: 16 }}>
        {inspections.map((i) => (
          <li key={i.id} style={{ marginBottom: 12 }}>
            <div>{new Date(i.capturedAt).toLocaleString()}</div>
            {i.lat !== null && i.lng !== null && (
              <div>
                {i.lat.toFixed(5)}, {i.lng.toFixed(5)}
              </div>
            )}
            <img src={i.photoPath} alt="inspection" style={{ width: 200, borderRadius: 4 }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
