import React, { useState } from "react";
import OrderModal from "./OrderModal";

export default function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const options =
    typeof order.options === "string"
      ? JSON.parse(order.options || "{}")
      : order.options || {};
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{
          background: "#fff",
          padding: 8,
          marginBottom: 8,
          boxShadow: "0 1px 2px rgba(0,0,0,.05)",
          cursor: "pointer",
        }}
      >
        <strong>{order.title}</strong>
        <div style={{ fontSize: 12 }}>
          {options.priority || "medium"} • {options.dueDate || ""}
        </div>
      </div>
      <OrderModal isOpen={open} onClose={() => setOpen(false)} order={order} />
    </>
  );
}
