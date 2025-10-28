import React from "react";

const labelStyle: React.CSSProperties = { display: "block", marginBottom: 8 };

type Props = {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
  style?: React.CSSProperties;
};

const Field: React.FC<Props> = ({ id, label, required, children, hint, style }) => (
  <div style={{ marginBottom: 18, ...style }}>
    <label htmlFor={id} style={labelStyle}>
      {label} {required ? <span aria-hidden="true" style={{ color: "#d00" }}>*</span> : null}
    </label>
    {children}
    {hint ? <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>{hint}</div> : null}
  </div>
);

export default Field;
