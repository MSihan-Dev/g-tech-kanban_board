import React from "react";
import { Draggable } from "react-beautiful-dnd";
import OrderCard from "./OrderCard";

export default function Column({ title, orders = [] }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 8, borderRadius: 6 }}>
      <h3>
        {title.toUpperCase()} ({orders.length})
      </h3>
      {orders.map((order, index) => (
        <Draggable key={order.id} draggableId={order.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <OrderCard order={order} />
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
}
