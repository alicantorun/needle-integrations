"use client";

import { api } from "~/trpc/react";

export function RunConnectorButton({ connectorId }: { connectorId: string }) {
  const { mutate: runWebConnector } = api.connectors.run.useMutation({
    onSuccess: () => {
      alert("Connector run started!");
    },
  });

  return (
    <button
      onClick={() => {
        const futureDate = new Date();
        futureDate.setMonth(futureDate.getMonth() + 6);

        runWebConnector({
          connectorId,
          // simulateDate: futureDate
        });
      }}
      className="mb-2 ml-4 mt-auto h-6 w-6 rounded-full bg-blue-500 text-white hover:bg-blue-600"
    >
      ▶
    </button>
  );
}
