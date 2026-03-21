interface Props {
  payload: Record<string, unknown>;
}

function Section({ title, data }: { title: string; data: Record<string, unknown> }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ margin: '0 0 8px', fontSize: 14, color: '#475569' }}>{title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '4px 16px', fontSize: 13 }}>
        {Object.entries(data).map(([k, v]) => (
          <div key={k} style={{ display: 'contents' }}>
            <div style={{ color: '#64748b' }}>{k}</div>
            <div style={{ margin: 0 }}>
              {typeof v === 'object' && v !== null && !Array.isArray(v)
                ? JSON.stringify(v)
                : String(v ?? '—')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StructuredPayload({ payload }: Props) {
  const person = payload.person as Record<string, unknown> | undefined;
  const address = payload.address as Record<string, unknown> | undefined;
  const income = payload.income as Record<string, unknown> | undefined;
  const loan = payload.loan as Record<string, unknown> | undefined;
  const creditHistory = payload.creditHistory as Record<string, unknown> | undefined;

  return (
    <div style={{ background: '#fff', padding: 20, borderRadius: 8, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <h2 style={{ margin: '0 0 16px', fontSize: 16 }}>Данные заявки</h2>
      <p style={{ margin: '0 0 16px', fontSize: 13 }}>
        <strong>Телефон:</strong> {String(payload.phone ?? '—')} · <strong>Email:</strong> {String(payload.email ?? '—')}
      </p>
      {loan && <Section title="Кредит" data={loan} />}
      {person && <Section title="Персона" data={person} />}
      {address && <Section title="Адрес" data={address} />}
      {income && <Section title="Доходы" data={income} />}
      {creditHistory && <Section title="Кредитная история" data={creditHistory} />}
    </div>
  );
}
