export type Tier = "normal" | "unique" | "rare" | "legendary" | "mythic" | "fabled";

export type AttributeIcon = {
  format: "attribute";
  value: { id: string; customModelData?: number };
};

export type SkinIcon = {
  format: "skin";
  value: string;
};

export type SlimIcon = AttributeIcon | SkinIcon;

export type SlimItem = {
  displayName: string;
  tier: Tier;
  icon: SlimIcon;
};

export type ItemsPayload = {
  fetchedAt: string;
  items: SlimItem[];
};
