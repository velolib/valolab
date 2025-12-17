import { useEffect, useState } from "react";
import { MapComposition } from "@/components/map-composition";
import { AgentSelector } from "@/components/agent-selector";
import { Button } from "@/components/ui/button";
import { Share2, Check, Trash } from "lucide-react";
import { Layout } from "@/components/layout";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { AGENT_DETAILS, AGENTS } from "./lib/agents";

const MAPS = [
  "Ascent",
  "Bind",
  "Haven",
  "Split",
  "Fracture",
  "Breeze",
  "Icebox",
  "Pearl",
  "Lotus",
  "Sunset",
  "Abyss",
  "Corrode",
];

type Compositions = Record<string, (string | null)[]>;

type SlotSelection = {
  map: string;
  slotIndex: number;
};

// Optimized bit-packed encoding that supports dynamic agent and map counts
// Format: [version(4)][mapCount(6)][agentCount(6)][mapData(variable bits per map)...]
function encodeCompositions(compositions: Compositions): string {
  const VERSION = 1; // Version for future compatibility (max 15)
  const agentCount = AGENTS.length; // max 63
  const mapCount = MAPS.length; // max 63

  // Calculate base and bits needed per map
  const base = agentCount + 1; // +1 for empty slot (0)
  const maxMapValue = Math.pow(base, 5) - 1;
  const bitsPerMap = Math.ceil(Math.log2(maxMapValue + 1));

  // Create bit array for efficient packing
  const bits: boolean[] = [];

  // Write header: version(4) + mapCount(6) + agentCount(6) = 16 bits
  for (let i = 3; i >= 0; i--) bits.push(((VERSION >> i) & 1) === 1);
  for (let i = 5; i >= 0; i--) bits.push(((mapCount >> i) & 1) === 1);
  for (let i = 5; i >= 0; i--) bits.push(((agentCount >> i) & 1) === 1);

  // Encode each map's composition
  for (const map of MAPS) {
    const agents = compositions[map] || [null, null, null, null, null];
    let mapNumber = 0;

    for (let i = 0; i < 5; i++) {
      const agent = agents[i];
      const agentIndex = agent ? AGENTS.indexOf(agent) + 1 : 0;
      mapNumber += agentIndex * Math.pow(base, i);
    }

    // Write map number using exact bits needed
    for (let i = bitsPerMap - 1; i >= 0; i--) {
      bits.push(((mapNumber >> i) & 1) === 1);
    }
  }

  // Convert bits to bytes
  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8 && i + j < bits.length; j++) {
      if (bits[i + j]) byte |= 1 << (7 - j);
    }
    bytes.push(byte);
  }

  // Convert bytes to base64
  if (typeof window !== "undefined") {
    const binaryString = String.fromCharCode(...bytes);
    return btoa(binaryString);
  }
  return "";
}

function decodeCompositions(hash: string): Compositions {
  const compositions: Compositions = {};

  if (!hash) return compositions;

  try {
    // Decode base64 to binary
    const binaryString = typeof window !== "undefined" ? atob(hash) : "";
    const bytes: number[] = [];
    for (let i = 0; i < binaryString.length; i++) {
      bytes.push(binaryString.charCodeAt(i));
    }

    // Convert bytes to bits
    const bits: boolean[] = [];
    for (const byte of bytes) {
      for (let i = 7; i >= 0; i--) {
        bits.push(((byte >> i) & 1) === 1);
      }
    }

    // Helper to read N bits as a number
    let bitIndex = 0;
    const readBits = (n: number): number => {
      let value = 0;
      for (let i = 0; i < n && bitIndex < bits.length; i++) {
        value = (value << 1) | (bits[bitIndex++] ? 1 : 0);
      }
      return value;
    };

    // Read header: version(4) + mapCount(6) + agentCount(6)
    const version = readBits(4);

    if (version === 1) {
      // Version 1: Bit-packed format
      const mapCount = readBits(6);
      const agentCount = readBits(6);
      const base = agentCount + 1;
      const maxMapValue = Math.pow(base, 5) - 1;
      const bitsPerMap = Math.ceil(Math.log2(maxMapValue + 1));

      // Decode each map
      for (let mapIdx = 0; mapIdx < Math.min(mapCount, MAPS.length); mapIdx++) {
        const map = MAPS[mapIdx];
        const mapNumber = readBits(bitsPerMap);

        if (mapNumber === 0) continue;

        const agents: (string | null)[] = [];
        let remaining = mapNumber;

        for (let i = 0; i < 5; i++) {
          const agentIndex = remaining % base;
          remaining = Math.floor(remaining / base);

          if (agentIndex === 0) {
            agents.push(null);
          } else if (agentIndex - 1 < AGENTS.length) {
            agents.push(AGENTS[agentIndex - 1]);
          } else {
            agents.push(null); // Agent no longer exists
          }
        }

        compositions[map] = agents;
      }
    } else {
      // Legacy format (no version in first 4 bits): 3 bytes per map, base-26
      // Reset and treat as byte-aligned legacy format
      const mapNumbers: number[] = [];
      for (let i = 0; i < 12 && i * 3 < bytes.length; i++) {
        const num =
          (bytes[i * 3] << 16) | (bytes[i * 3 + 1] << 8) | bytes[i * 3 + 2];
        mapNumbers.push(num);
      }

      for (let mapIdx = 0; mapIdx < MAPS.length; mapIdx++) {
        const map = MAPS[mapIdx];
        const mapNumber = mapNumbers[mapIdx] || 0;

        if (mapNumber === 0) continue;

        const agents: (string | null)[] = [];
        let remaining = mapNumber;

        for (let i = 0; i < 5; i++) {
          const agentIndex = remaining % 26;
          remaining = Math.floor(remaining / 26);

          if (agentIndex === 0) {
            agents.push(null);
          } else {
            agents.push(AGENTS[agentIndex - 1] || null);
          }
        }

        compositions[map] = agents;
      }
    }
  } catch (e) {
    console.error("Failed to decode compositions:", e);
  }

  return compositions;
}

export default function Page() {
  const [compositions, setCompositions] = useState<Compositions>(() => {
    if (typeof window === "undefined") return {};
    try {
      const params = new URLSearchParams(window.location.search);
      const dataParam = params.get("c");
      return dataParam ? decodeCompositions(dataParam) : {};
    } catch (e) {
      console.error("Failed to parse URL data:", e);
      return {};
    }
  });
  const [slotSelection, setSlotSelection] = useState<SlotSelection | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  // initial compositions are loaded from the URL in the useState initializer above

  useEffect(() => {
    if (Object.keys(compositions).length > 0) {
      const encoded = encodeCompositions(compositions);

      if (encoded) {
        const newUrl = `${window.location.pathname}?c=${encoded}`;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, [compositions]);

  const updateAgent = (
    map: string,
    slotIndex: number,
    agent: string | null,
  ) => {
    setCompositions((prev) => {
      const current = prev[map] || [null, null, null, null, null];
      const updated = [...current];
      updated[slotIndex] = agent;
      return {
        ...prev,
        [map]: updated,
      };
    });
  };

  const handleResetMap = (map: string) => {
    setCompositions((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [map]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast("Link copied!", {
        description: "Share this URL to share your compositions",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Failed to copy", {
        description: "Please copy the URL manually",
        icon: "error",
      });
    }
  };

  const getPlayerOverview = () => {
    const playerAgents: Record<number, Set<string>> = {
      0: new Set(),
      1: new Set(),
      2: new Set(),
      3: new Set(),
      4: new Set(),
    };

    // Collect all agents for each player slot across all maps
    for (const map of MAPS) {
      const agents = compositions[map] || [null, null, null, null, null];
      agents.forEach((agent, slotIndex) => {
        if (agent) {
          playerAgents[slotIndex].add(agent);
        }
      });
    }

    return playerAgents;
  };

  const playerAgents = getPlayerOverview();

  return (
    <Layout>
      <div className="grid w-full grid-cols-2 gap-4">
        <Button onClick={handleShare}>
          {copied ? (
            <>
              <Check className="size-4.5" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="size-4.5" />
              Share Compositions
            </>
          )}
        </Button>
        <Button onClick={() => setCompositions({})} variant="destructive">
          <Trash className="size-4.5" />
          Reset All
        </Button>
      </div>

      {/* Map Grid */}
      <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MAPS.map((map) => (
          <MapComposition
            key={map}
            map={map}
            agents={compositions[map] || [null, null, null, null, null]}
            onSelectSlot={(slotIndex) => setSlotSelection({ map, slotIndex })}
            onReset={() => handleResetMap(map)}
          />
        ))}
      </div>

      <div className="border-t pt-4">
        <h2 className="text-foreground mb-4 text-2xl font-bold">
          Player Agent Pool
        </h2>
        <div className="space-y-6">
          {[0, 1, 2, 3, 4].map((playerIndex) => (
            <div key={playerIndex} className="flex items-center gap-4">
              <div className="w-24 shrink-0">
                <div className="text-muted-foreground text-sm font-medium">
                  Player {playerIndex + 1}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {playerAgents[playerIndex].size > 0 ? (
                  Array.from(playerAgents[playerIndex]).map((agent) => (
                    <div key={agent} className="group relative" title={agent}>
                      <img
                        src={AGENT_DETAILS[agent].icon}
                        alt={agent}
                        className="bg-card h-12 w-12 rounded border object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded bg-black/60 capitalize opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="text-xs font-medium text-white">
                          {AGENT_DETAILS[agent].name}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground text-sm italic">
                    No agents assigned
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Agent Selector Modal */}
      {slotSelection && (
        <AgentSelector
          map={slotSelection.map}
          slotIndex={slotSelection.slotIndex}
          currentAgent={
            compositions[slotSelection.map]?.[slotSelection.slotIndex] || null
          }
          selectedAgents={
            compositions[slotSelection.map] || [null, null, null, null, null]
          }
          availableAgents={AGENTS}
          onUpdate={(agent) => {
            updateAgent(slotSelection.map, slotSelection.slotIndex, agent);
            setSlotSelection(null);
          }}
          open={slotSelection !== null}
          onOpenChange={(open) => {
            if (!open) {
              setSlotSelection(null);
            }
          }}
        />
      )}
      <Toaster />
    </Layout>
  );
}
