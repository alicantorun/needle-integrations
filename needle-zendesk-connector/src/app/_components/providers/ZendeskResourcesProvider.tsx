"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "~/trpc/react";
import type {
  ZendeskTicket,
  ZendeskArticle,
  ZendeskOrganization,
} from "~/server/zendesk/types";

type ZendeskType = "ticket" | "article";

type ZendeskResourcesContextType = {
  selectedTickets: ZendeskTicket[];
  selectedArticles: ZendeskArticle[];
  setSelectedTickets: (tickets: ZendeskTicket[]) => void;
  setSelectedArticles: (articles: ZendeskArticle[]) => void;
  tickets: ZendeskTicket[];
  articles: ZendeskArticle[];
  organizations: ZendeskOrganization[];
  selectedOrganizationId: number | null;
  setSelectedOrganizationId: (id: number | null) => void;
  selectedSubdomain: string | null;
  setSelectedSubdomain: (subdomain: string | null) => void;
  isLoading: boolean;
  selectedTypes: ZendeskType[];
  setSelectedTypes: (types: ZendeskType[]) => void;
};

const ZendeskResourcesContext =
  createContext<ZendeskResourcesContextType | null>(null);

interface ZendeskResourcesProviderProps {
  children: React.ReactNode;
  organizations: ZendeskOrganization[];
  credentials: string;
}

export function ZendeskResourcesProvider({
  children,
  organizations,
  credentials,
}: ZendeskResourcesProviderProps) {
  const [selectedTickets, setSelectedTickets] = useState<ZendeskTicket[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<ZendeskArticle[]>(
    [],
  );
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    number | null
  >(null);
  const [selectedSubdomain, setSelectedSubdomain] = useState<string | null>(
    null,
  );
  const [selectedTypes, setSelectedTypes] = useState<ZendeskType[]>([]);
  const [tickets, setTickets] = useState<ZendeskTicket[]>([]);
  const [articles, setArticles] = useState<ZendeskArticle[]>([]);

  // Fetch data when organization is selected
  const { data: resourcesData, isLoading: isLoadingResources } =
    api.connectors.getData.useQuery(
      {
        accessToken: credentials,
        organizationId: selectedOrganizationId!,
        fetchArticles: selectedTypes.includes("article"),
        fetchTickets: selectedTypes.includes("ticket"),
      },
      {
        enabled: !!selectedOrganizationId,
      },
    );

  const resetSelections = useCallback(() => {
    setSelectedTickets([]);
    setSelectedArticles([]);
  }, []);

  const resetAll = useCallback(() => {
    resetSelections();
    setTickets([]);
    setArticles([]);
  }, [resetSelections]);

  useEffect(() => {
    if (resourcesData) {
      setTickets(resourcesData.tickets?.items ?? []);
      setArticles(resourcesData.articles?.items ?? []);
    }
  }, [resourcesData]);

  useEffect(() => {
    if (selectedOrganizationId) {
      resetSelections();
    } else {
      resetAll();
    }
  }, [selectedOrganizationId, resetSelections, resetAll]);

  return (
    <ZendeskResourcesContext.Provider
      value={{
        selectedTickets,
        selectedArticles,
        setSelectedTickets,
        setSelectedArticles,
        tickets,
        articles,
        organizations,
        selectedOrganizationId,
        setSelectedOrganizationId,
        selectedSubdomain,
        setSelectedSubdomain,
        isLoading: isLoadingResources,
        selectedTypes,
        setSelectedTypes,
      }}
    >
      {children}
    </ZendeskResourcesContext.Provider>
  );
}

export function useZendeskResources() {
  const context = useContext(ZendeskResourcesContext);
  if (!context) {
    throw new Error(
      "useZendeskResources must be used within a ZendeskResourcesProvider",
    );
  }
  return context;
}
