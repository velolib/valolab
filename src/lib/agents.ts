import astraIcon from "@/assets/agents/astra.webp";
import breachIcon from "@/assets/agents/breach.webp";
import brimstoneIcon from "@/assets/agents/brimstone.webp";
import chamberIcon from "@/assets/agents/chamber.webp";
import cloveIcon from "@/assets/agents/clove.webp";
import cypherIcon from "@/assets/agents/cypher.webp";
import deadlockIcon from "@/assets/agents/deadlock.webp";
import fadeIcon from "@/assets/agents/fade.webp";
import gekkoIcon from "@/assets/agents/gekko.webp";
import harborIcon from "@/assets/agents/harbor.webp";
import isoIcon from "@/assets/agents/iso.webp";
import jettIcon from "@/assets/agents/jett.webp";
import kayoIcon from "@/assets/agents/kayo.webp";
import killjoyIcon from "@/assets/agents/killjoy.webp";
import neonIcon from "@/assets/agents/neon.webp";
import omenIcon from "@/assets/agents/omen.webp";
import phoenixIcon from "@/assets/agents/phoenix.webp";
import razeIcon from "@/assets/agents/raze.webp";
import reynaIcon from "@/assets/agents/reyna.webp";
import sageIcon from "@/assets/agents/sage.webp";
import skyeIcon from "@/assets/agents/skye.webp";
import sovaIcon from "@/assets/agents/sova.webp";
import tejoIcon from "@/assets/agents/tejo.webp";
import vetoIcon from "@/assets/agents/veto.webp";
import viperIcon from "@/assets/agents/viper.webp";
import vyseIcon from "@/assets/agents/vyse.webp";
import waylayIcon from "@/assets/agents/waylay.webp";
import yoruIcon from "@/assets/agents/yoru.webp";

import duelistIcon from "@/assets/roles/duelist.webp";
import controllerIcon from "@/assets/roles/controller.webp";
import initiatorIcon from "@/assets/roles/initiator.webp";
import sentinelIcon from "@/assets/roles/sentinel.webp";

export const AGENT_DETAILS: Record<
  string,
  {
    name: string;
    icon: string;
    role: string;
  }
> = {
  astra: { name: "Astra", icon: astraIcon, role: "controller" },
  breach: { name: "Breach", icon: breachIcon, role: "initiator" },
  brimstone: { name: "Brimstone", icon: brimstoneIcon, role: "controller" },
  chamber: { name: "Chamber", icon: chamberIcon, role: "sentinel" },
  clove: { name: "Clove", icon: cloveIcon, role: "controller" },
  cypher: { name: "Cypher", icon: cypherIcon, role: "sentinel" },
  deadlock: { name: "Deadlock", icon: deadlockIcon, role: "sentinel" },
  fade: { name: "Fade", icon: fadeIcon, role: "initiator" },
  gekko: { name: "Gekko", icon: gekkoIcon, role: "initiator" },
  harbor: { name: "Harbor", icon: harborIcon, role: "controller" },
  iso: { name: "Iso", icon: isoIcon, role: "duelist" },
  jett: { name: "Jett", icon: jettIcon, role: "duelist" },
  kayo: { name: "KAY/O", icon: kayoIcon, role: "initiator" },
  killjoy: { name: "Killjoy", icon: killjoyIcon, role: "sentinel" },
  neon: { name: "Neon", icon: neonIcon, role: "duelist" },
  omen: { name: "Omen", icon: omenIcon, role: "controller" },
  phoenix: { name: "Phoenix", icon: phoenixIcon, role: "duelist" },
  raze: { name: "Raze", icon: razeIcon, role: "duelist" },
  reyna: { name: "Reyna", icon: reynaIcon, role: "duelist" },
  sage: { name: "Sage", icon: sageIcon, role: "sentinel" },
  skye: { name: "Skye", icon: skyeIcon, role: "initiator" },
  sova: { name: "Sova", icon: sovaIcon, role: "initiator" },
  tejo: { name: "Tejo", icon: tejoIcon, role: "initiator" },
  veto: { name: "Veto", icon: vetoIcon, role: "sentinel" },
  viper: { name: "Viper", icon: viperIcon, role: "controller" },
  vyse: { name: "Vyse", icon: vyseIcon, role: "sentinel" },
  waylay: { name: "Waylay", icon: waylayIcon, role: "duelist" },
  yoru: { name: "Yoru", icon: yoruIcon, role: "duelist" },
};

export const AGENTS = Object.keys(AGENT_DETAILS);

export const ROLE_ICONS: Record<string, string> = {
  duelist: duelistIcon,
  controller: controllerIcon,
  initiator: initiatorIcon,
  sentinel: sentinelIcon,
};
