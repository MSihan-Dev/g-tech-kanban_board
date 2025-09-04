import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Column from "./Column";

const statuses = ["new", "process", "complete", "return"];

const fetchOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

const moveOrder = async ({ id, status }) => {
  const { data } = await api.post(`/orders/${id}/move`, { status });
  return data;
};

export default function KanbanBoard() {
  const qc = useQueryClient();
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery(["orders"], fetchOrders);
  const mutation = useMutation(moveOrder, {
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries(["orders"]);
      const previous = qc.getQueryData(["orders"]);
      qc.setQueryData(["orders"], (old) => {
        return old.map((o) => (o.id === id ? { ...o, status } : o));
      });
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) qc.setQueryData(["orders"], context.previous);
    },
    onSettled: () => qc.invalidateQueries(["orders"]),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading orders</div>;

  const grouped = statuses.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s);
    return acc;
  }, {});

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const from = source.droppableId;
    const to = destination.droppableId;
    if (from === to) return;
    mutation.mutate({ id: draggableId, status: to });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", gap: 16 }}>
        {statuses.map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ minWidth: 250 }}
              >
                <Column title={status} orders={grouped[status]} />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
