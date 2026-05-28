import { useState } from "react";
import data from "./data/allskills.json";
import "./App.css";

const allSkills = [...data.passives, ...data.actives];

const tierColors = {
  mortal: "tier-mortal",
  earth: "tier-earth",
  sky: "tier-sky",
  nascent: "tier-nascent",
};

const rarityBorders = {
  starter: "rarity-common",
  common: "rarity-common",
  uncommon: "rarity-uncommon",
  rare: "rarity-rare",
  epic: "rarity-epic",
  legendary: "rarity-legendary",
};

const alignmentLabels = {
  R: { label: "Righteous", class: "align-r" },
  N: { label: "Neutral", class: "align-n" },
  D: { label: "Demonic", class: "align-d" },
};

/* ✅ Obtain decoding */
const obtainMap = {
  STARTER: "Granted by default",
  "SHOP-M": "Mortal shop",
  "SHOP-E": "Earth shop",
  "CRAFT-M": "Mortal crafting pool",
  "CRAFT-E": "Earth crafting pool",
  "CRAFT-S": "Sky crafting pool",
  "CRAFT-N": "Nascent crafting pool",
  "ADV-R": "Righteous adventure",
  "ADV-N": "Neutral adventure",
  "ADV-D": "Demonic adventure",
  "BT-R": "Righteous breakthrough",
  "BT-N": "Neutral breakthrough",
  "BT-D": "Demonic breakthrough",
};

/* ✅ Sect decoding */
const sectMap = {
  "SECT-WUDANG": "Wudang Sword Sect",
  "SECT-SHAOLIN": "Shaolin Vajra Temple",
  "SECT-TANG": "Tang Shadow Hall",
  "SECT-EMEI": "Emei Lotus Palace",
  "SECT-BEGGAR": "Beggar Union",
  "SECT-BLOOD": "Demonic Blood Cult",
  "SECT-ELEMENTS": "Five Elements Pavilion",
  "SECT-GHOST": "Ghost Valley Sect",
};

/* ✅ Helper to decode obtain strings */
function decodeObtain(code) {
  if (code.startsWith("HUNT-")) return `Elite Hunt: ${code.slice(5)}`;
  if (code.startsWith("DUN-")) return `Dungeon Reward: ${code.slice(4)}`;
  if (code.startsWith("RARE-")) return `Rare Event: ${code.slice(5)}`;

  if (sectMap[code]) return `Sect: ${sectMap[code]}`;

  return obtainMap[code] || code;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState("all");
  const [type, setType] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const filtered = allSkills.filter((s) => {
    return (
      (tier === "all" || s.tier === tier) &&
      (type === "all" || s.slot_type === type) &&
      (s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.technical_description.toLowerCase().includes(query.toLowerCase()))
    );
  });

  return (
    <div className="container">
      <h1 className="title">Skill Browser</h1>

      {/* Controls */}
      <div className="controls">
        <input
          placeholder="Search skills..."
          className="search"
          onChange={(e) => setQuery(e.target.value)}
        />

        <select onChange={(e) => setTier(e.target.value)}>
          <option value="all">All tiers</option>
          <option value="mortal">Mortal</option>
          <option value="earth">Earth</option>
          <option value="sky">Sky</option>
          <option value="nascent">Nascent</option>
        </select>
      </div>

      {/* Toggle */}
      <div className="toggle">
        {["all", "active", "passive"].map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`toggle-btn ${type === t ? "active-btn" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid">
        {filtered.map((s) => {
          const alignment = alignmentLabels[s.alignment];
          const isExpanded = expandedId === s.id;

          return (
            <div
              key={s.id}
              className={`card ${tierColors[s.tier]} ${
                rarityBorders[s.rarity]
              }`}
              onClick={() =>
                setExpandedId(isExpanded ? null : s.id)
              }
            >
              {/* Header */}
              <div className="card-header">
                <h2 className="skill-title">{s.name}</h2>
                <span className={`badge ${alignment.class}`}>
                  {alignment.label}
                </span>
              </div>

              {/* Type */}
              <div
                className={`type ${
                  s.slot_type === "active" ? "type-active" : "type-passive"
                }`}
              >
                {s.slot_type === "active" ? "⚔ Active Skill" : "🧘 Passive Skill"}
              </div>

              {/* Description */}
              <div className="description-box">
                {s.technical_description}
              </div>

              {/* Meta */}
              <div className="meta">
                Tier: {s.tier} • Rarity: {s.rarity}
              </div>

              {s.cooldown !== undefined && (
                <div className="cooldown">Cooldown: {s.cooldown}</div>
              )}

              {/* ✅ EXPANDED SECTION */}
              {isExpanded && (
                <div className="expand">
                  <h4>How to Obtain</h4>

                  <ul>
                    {s.obtain?.map((o, i) => (
                      <li key={i}>{decodeObtain(o)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
``