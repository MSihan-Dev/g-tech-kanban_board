import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:4000";
const statuses = ["new", "process", "complete", "return"];

const statusConfig = {
  new: { title: "New", color: "#4f46e5" },
  process: { title: "In Process", color: "#f59e0b" },
  complete: { title: "Complete", color: "#10b981" },
  return: { title: "Returned", color: "#ef4444" },
};

const priorityColors = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#10b981",
};

export default function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/orders`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) =>
        setOrders(
          data.map((o) => ({
            ...o,
            options: o.options ? JSON.parse(o.options) : {},
          }))
        )
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const moveOrder = async (id, toStatus) => {
    try {
      await fetch(`${API}/orders/${id}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toStatus }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: toStatus } : o))
      );
    } catch (err) {
      console.error("Error moving order:", err);
      alert("Failed to move order");
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="kanban-container">
      <header className="kanban-header">
        <h1>G-Tech Order Management Board</h1>
        <div className="stats">Total Orders: {orders.length}</div>
      </header>

      <div className="board">
        {statuses.map((status) => (
          <Column
            key={status}
            status={status}
            title={statusConfig[status].title}
            color={statusConfig[status].color}
            orders={orders.filter((o) => o.status === status)}
            onMove={moveOrder}
          />
        ))}
      </div>
    </div>
  );
}

function Column({ title, orders, onMove, status, color }) {
  return (
    <div className="column" style={{ borderTop: `4px solid ${color}` }}>
      <div className="column-header">
        <h3>{title}</h3>
        <span className="badge">{orders.length}</span>
      </div>
      <div className="column-content">
        {orders.length === 0 && <p className="empty">No orders</p>}
        {orders.map((order) => (
          <Card key={order.id} order={order} onMove={onMove} />
        ))}
      </div>
    </div>
  );
}

function Card({ order, onMove }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const priority = order.options?.priority || "medium";
  const dueDate = order.options?.dueDate;
  const isOverdue = dueDate && new Date(dueDate) < new Date();

  return (
    <div className="card">
      <div className="card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="card-title">
          <h4>{order.title}</h4>
          <span
            className="priority-indicator"
            style={{
              backgroundColor:
                priorityColors[priority] || priorityColors.medium,
            }}
            title={`${priority} priority`}
          ></span>
        </div>
        <span className={`expand-icon ${isExpanded ? "expanded" : ""}`}>▼</span>
      </div>

      <div className="card-details">
        {dueDate && (
          <div className="due-date">
            <span className={`due-text ${isOverdue ? "overdue" : ""}`}>
              {isOverdue ? "Overdue: " : "Due: "}
              {dueDate}
            </span>
          </div>
        )}

        {isExpanded && order.description && (
          <div className="description">
            <p>{order.description}</p>
          </div>
        )}
      </div>

      <div className="actions">
        {statuses
          .filter((s) => s !== order.status)
          .map((s) => (
            <button
              key={s}
              onClick={() => onMove(order.id, s)}
              className="move-btn"
              style={{ backgroundColor: statusConfig[s].color }}
            >
              → {statusConfig[s].title}
            </button>
          ))}
      </div>
    </div>
  );
}
