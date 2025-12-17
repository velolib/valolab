import { Card } from "@/components/ui/card";
import { AGENT_DETAILS, ROLE_ICONS } from "@/lib/agents";
import { Button } from "./ui/button";
import { RefreshCcw, X } from "lucide-react";

interface MapCompositionProps {
  map: string;
  agents: (string | null)[];
  onSelectSlot: (slotIndex: number) => void;
  onReset: () => void;
}

export function MapComposition({
  map,
  agents,
  onSelectSlot,
  onReset,
}: MapCompositionProps) {
  const selectedCount = agents.filter((agent) => agent !== null).length;

  const roles = agents
    .map((agent) => (agent ? AGENT_DETAILS[agent].role : null))
    .filter(Boolean) as string[];

  const roleCounts = roles.reduce(
    (acc, role) => {
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const allRoleKeys = Object.keys(ROLE_ICONS);
  const duplicateRoles = Object.entries(roleCounts).filter(
    ([, count]) => count >= 2,
  );
  const missingRoles = allRoleKeys.filter((role) => !roleCounts[role]);

  const roleAnalysis = (
    <div className="flex items-center gap-3">
      {duplicateRoles.map(([role, count]) => (
        <div
          key={role}
          className="flex items-center gap-1"
          title={`${count} ${role}s`}
        >
          <span className="text-foreground size-3.5 font-bold">{count}</span>
          <img src={ROLE_ICONS[role]} alt={role} className="size-4" />
        </div>
      ))}
      {missingRoles.map((role) => (
        <div
          key={role}
          className="flex items-center gap-1"
          title={`Missing ${role}`}
        >
          <X className="text-destructive size-3.5" />
          <img
            src={ROLE_ICONS[role]}
            alt={role}
            className="size-4 opacity-50"
          />
        </div>
      ))}
    </div>
  );

  return (
    <Card className="rounded-lg p-4">
      <div className="flex">
        <h3 className="text-foreground mb-3 text-lg font-semibold">{map}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => onReset()}
        >
          <RefreshCcw className="size-4.5" />
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {agents.map((agent, index) => (
          <button
            key={index}
            onClick={() => onSelectSlot(index)}
            className="bg-secondary hover:border-primary group relative aspect-square cursor-pointer overflow-hidden rounded-md border transition-all"
          >
            {agent ? (
              <>
                <img
                  src={AGENT_DETAILS[agent].icon}
                  alt={agent}
                  className="h-full w-full object-cover"
                />
                <div className="bg-primary text-primary-foreground absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
                  <img
                    src={ROLE_ICONS[AGENT_DETAILS[agent].role]}
                    alt={AGENT_DETAILS[agent].role}
                    className="h-3.5 w-3.5"
                  />
                </div>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center"></div>
            )}
          </button>
        ))}
      </div>

      <div className="flex">
        <div className="text-muted-foreground mt-3 text-xs">
          {selectedCount}/5 agents selected
        </div>
        <div className="text-muted-foreground mt-3 ml-auto text-xs">
          {roleAnalysis}
        </div>
      </div>
    </Card>
  );
}
