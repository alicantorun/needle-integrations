/* eslint-disable @next/next/no-img-element */
"use client";

import { useSlackResources } from "../providers/SlackResourcesProvider";
import { CreateConnectorForm } from "../CreateConnnectorForm";
import { type Collection } from "@needle-ai/needle-sdk";
import { formatDateTime } from "~/utils/format-date-time";
import { SlackResourceInfo } from "./SlackResourceInfo";
import { type SlackChannel } from "~/server/db/schema"; // Import the type

export function SlackWorkspacePreview({
  collections,
  credentials,
}: {
  collections: Collection[];
  credentials: string;
}) {
  const {
    channels,
    messages,
    workspace,
    selectedChannels,
    setSelectedChannels,
  } = useSlackResources();

  const handleChannelToggle = (channel: SlackChannel) => {
    const isSelected = selectedChannels.some((c) => c.id === channel.id);
    const newChannels = isSelected
      ? selectedChannels.filter((c) => c.id !== channel.id)
      : [...selectedChannels, channel];
    setSelectedChannels(newChannels);
  };

  return (
    <div className="my-8 space-y-6">
      {workspace && (
        <div
          key={workspace.team.id}
          className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
        >
          <div className="flex items-center gap-4">
            <img
              src={workspace.team.icon?.image_68 ?? "/icons/slack.svg"}
              alt={workspace.team.name}
              className="h-12 w-12 rounded-lg"
            />
            <div>
              <h2 className="text-xl font-semibold">{workspace.team.name}</h2>
              <p className="text-sm text-zinc-500">
                {workspace.team.domain}.slack.com
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Channels ({channels?.length ?? 0})
              </h3>
            </div>

            <div className="space-y-2">
              {channels?.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => handleChannelToggle(channel)}
                  className="flex cursor-pointer items-center rounded-md border border-zinc-200 p-4 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  <input
                    type="checkbox"
                    checked={selectedChannels.some((c) => c.id === channel.id)}
                    className="mr-4 rounded border-gray-300"
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => handleChannelToggle(channel)}
                  />
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <p className="font-medium">#{channel.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent Messages</h3>
            </div>

            <div className="space-y-2">
              {messages?.map((message) => (
                <div
                  key={message.ts}
                  className="rounded-md border border-zinc-200 p-4 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{message.user}</span>
                        <span className="text-sm text-zinc-500">in</span>
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          #{message.channelName}
                        </span>
                      </div>
                      <span className="text-sm text-zinc-500">
                        {formatDateTime(
                          new Date(Number(message.ts) * 1000).toISOString(),
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {message.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <SlackResourceInfo />
      <CreateConnectorForm
        collections={collections}
        credentials={credentials}
      />
    </div>
  );
}
