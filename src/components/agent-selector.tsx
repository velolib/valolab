import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AGENT_DETAILS, ROLE_ICONS } from "@/lib/agents";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface AgentSelectorProps {
  map: string;
  slotIndex: number;
  currentAgent: string | null;
  selectedAgents: (string | null)[];
  availableAgents: string[];
  onUpdate: (agent: string | null) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgentSelector({
  map,
  slotIndex,
  currentAgent,
  selectedAgents,
  availableAgents,
  onUpdate,
  open,
  onOpenChange,
}: AgentSelectorProps) {
  const [searchFilter, setSearchFilter] = useState("");

  const filteredAgents = availableAgents.filter((agent) => {
    // Allow current agent or agents not already selected in other slots
    const isAlreadySelected = selectedAgents.some(
      (selectedAgent, idx) => selectedAgent === agent && idx !== slotIndex,
    );
    return (
      !isAlreadySelected &&
      agent.toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  const handleSelectAgent = (agent: string) => {
    onUpdate(agent);
  };

  const handleRemoveAgent = () => {
    onUpdate(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col p-0">
        {/* Header */}
        <DialogHeader className="flex items-center justify-between border-b p-6 text-left">
          <div>
            <DialogTitle className="text-foreground text-2xl font-bold">
              {map} - <span className="text-primary">Slot {slotIndex + 1}</span>
            </DialogTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              {currentAgent
                ? `Current: ${currentAgent}`
                : "Select an agent for this slot"}
            </p>
          </div>
        </DialogHeader>

        {/* Search Bar */}
        <div className="border-border border-b p-6">
          <input
            type="text"
            placeholder="Search agents..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-md border px-4 py-2 focus:ring-2 focus:outline-none"
          />
        </div>

        {/* Agent Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {filteredAgents.map((agent) => {
              const isCurrentAgent = agent === currentAgent;

              const isAlreadySelected = selectedAgents.some(
                (selectedAgent, idx) =>
                  selectedAgent === agent && idx !== slotIndex,
              );

              return (
                <button
                  key={agent}
                  onClick={() => !isAlreadySelected && handleSelectAgent(agent)}
                  disabled={isAlreadySelected}
                  className={`relative aspect-square overflow-hidden rounded-md transition-all ${
                    isCurrentAgent
                      ? "ring-primary shadow-lg ring-2"
                      : isAlreadySelected
                        ? "ring-border cursor-not-allowed opacity-40 ring-1"
                        : "ring-border hover:ring-primary cursor-pointer ring-1"
                  } `}
                >
                  <img
                    src={AGENT_DETAILS[agent].icon}
                    alt={agent}
                    className="h-full w-full object-cover"
                  />

                  {/* Agent Name Overlay */}
                  <div
                    className={`absolute inset-x-0 bottom-0 p-2 text-center text-xs font-medium ${isCurrentAgent ? "bg-primary text-primary-foreground" : "bg-background/90 text-foreground"} `}
                  >
                    {AGENT_DETAILS[agent].name}
                  </div>

                  {/* Role Badge */}
                  <div className="bg-primary absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full">
                    <img
                      src={ROLE_ICONS[AGENT_DETAILS[agent].role]}
                      alt={AGENT_DETAILS[agent].role}
                      className="h-4 w-4"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-end gap-3 border-t p-6">
          {currentAgent && (
            <Button
              variant="outline"
              onClick={handleRemoveAgent}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
            >
              <Trash2 className="mr-2 size-4.5" />
              Remove Agent
            </Button>
          )}
          <DialogClose asChild>
            <Button
              variant="outline"
              className="text-foreground hover:bg-secondary bg-transparent"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
