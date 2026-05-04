import React from 'react';

const toneStyles = {
  teal: { accent: '#305CB5', border: '#B8C3D7', bg: '#EBF0F6' },
  amber: { accent: '#8894C4', border: '#B8C3D7', bg: '#EBF0F6' },
  rose: { accent: '#6371B1', border: '#B8C3D7', bg: '#EBF0F6' },
  sky: { accent: '#5882D3', border: '#B8C3D7', bg: '#EBF0F6' },
  slate: { accent: '#86A5CB', border: '#B8C3D7', bg: '#EBF0F6' },
};

const AdminMetricCard = ({ label, value, helper, tone = 'slate' }) => {
  const toneStyle = toneStyles[tone] || toneStyles.slate;

  return (
    <div
      className="admin-card admin-kpi rounded-2xl px-5 py-4"
      style={{ borderColor: toneStyle.border, background: toneStyle.bg, borderLeftColor: toneStyle.accent }}
    >
      <p className="admin-label text-[0.65rem]">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="admin-title text-3xl font-semibold tracking-tight">{value}</p>
        {helper ? <span className="text-xs admin-muted">{helper}</span> : null}
      </div>
    </div>
  );
};

export default AdminMetricCard;
