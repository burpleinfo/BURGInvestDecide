import React from 'react';

const AdminSectionHeader = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {subtitle ? (
          <p className="admin-label">{subtitle}</p>
        ) : null}
        <h2 className="admin-title mt-2 text-2xl font-semibold">{title}</h2>
      </div>
      {action ? <div className="flex flex-wrap items-center gap-2">{action}</div> : null}
    </div>
  );
};

export default AdminSectionHeader;
