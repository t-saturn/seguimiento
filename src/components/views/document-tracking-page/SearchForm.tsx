"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
  onSearch: (expedienteId: string) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [expedienteId, setExpedienteId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(expedienteId);
  };

  return (
    <form
      className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-center gap-4 mb-10 bg-white/70 dark:bg-gray-900/60 p-4 rounded-2xl shadow-md backdrop-blur-md border border-muted/40 transition-all"
      onSubmit={handleSubmit}
    >
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="N° expediente Ejm. (GGOTIC20250000001)"
          className="w-full pl-10 h-12 rounded-md border border-input bg-input text-base focus:ring-2 focus:ring-primary focus:outline-none"
          value={expedienteId}
          onChange={(e) => setExpedienteId(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        className="h-12 px-6 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-transform duration-150 hover:scale-105"
        disabled={loading}
      >
        {loading ? "Buscando..." : "Buscar"}
      </Button>
    </form>

  );
}