"use client";

import { useState } from "react";
import {
  MapPin,
  Globe,
  TrendingUp,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  StatCard,
  Button,
  PaperCard,
  Stamp,
  Badge,
  Chip,
  useToast,
} from "@/components/ui";
import { analytics, fmtNum } from "@/lib/data";

const PALETTE = {
  gold: "#b8893a",
  ink: "#2a1f1a",
  blue: "#2a4f76",
  green: "#3f6b3f",
  red: "#a8362e",
  sunset: "#d77032",
};

// Extended city data with country flags and lat/lon (relative % for "map" placement)
const CITY_EXTENDED = [
  { ...analytics.byCity[0], flag: "🇫🇷", country: "France", x: 48, y: 38, growth: "+14,2 %" },
  { ...analytics.byCity[1], flag: "🇵🇹", country: "Portugal", x: 38, y: 52, growth: "+22,1 %" },
  { ...analytics.byCity[2], flag: "🇪🇸", country: "Espagne", x: 44, y: 53, growth: "+11,8 %" },
  { ...analytics.byCity[3], flag: "🇮🇹", country: "Italie", x: 54, y: 46, growth: "+8,4 %" },
  { ...analytics.byCity[4], flag: "🇲🇦", country: "Maroc", x: 42, y: 60, growth: "+31,5 %" },
  { ...analytics.byCity[5], flag: "🇯🇵", country: "Japon", x: 82, y: 44, growth: "+18,9 %" },
  { ...analytics.byCity[6], flag: "🌍", country: "Autres", x: 60, y: 35, growth: "+9,2 %" },
];

const total = CITY_EXTENDED.reduce((s, c) => s + c.value, 0);

export default function GeographyPage() {
  const { push } = useToast();
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<"volume" | "growth">("volume");

  const sorted = [...CITY_EXTENDED].sort((a, b) =>
    sortMode === "volume" ? b.value - a.value : parseFloat(b.growth) - parseFloat(a.growth)
  );

  const topCity = CITY_EXTENDED[0];

  return (
    <AdminPage
      title="Géographie"
      eyebrow="où voyage la communauté ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/analytics", label: "Analytics" },
        { label: "Géographie" },
      ]}
      actions={
        <Button
          variant="paper"
          size="sm"
          icon={<Download size={14} />}
          onClick={() => push("Export géographique en cours…", "info")}
        >
          Exporter
        </Button>
      }
    >
      {/* KPIs */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 stagger">
        <StatCard label="Sessions totales" value={fmtNum(total)} delta="+12,4 %" icon={<Globe size={16} />} tone="ink" />
        <StatCard label="Ville n°1" value={topCity.city} delta={topCity.growth} icon={<MapPin size={16} />} tone="gold" />
        <StatCard label="Pays couverts" value="32" delta="+4 pays" icon={<TrendingUp size={16} />} tone="blue" />
        <StatCard label="Plus forte croissance" value="Marrakech" delta="+31,5 %" icon={<TrendingUp size={16} />} tone="green" />
      </section>

      {/* BarChart */}
      <PaperCard shadow="soft" className="p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
              Volume par destination
            </p>
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5">
              Sessions par ville
            </h3>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={analytics.byCity} margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" vertical={false} />
            <XAxis dataKey="city" tick={{ fontSize: 11, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
            <YAxis tick={{ fontSize: 10, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: "#fbf6e9", border: "1.5px solid #2a1f1a", borderRadius: 4, fontSize: 12 }}
              formatter={(v) => fmtNum(Number(v ?? 0))}
            />
            <Bar dataKey="value" name="Sessions" radius={[4, 4, 0, 0]} fill={PALETTE.blue} />
          </BarChart>
        </ResponsiveContainer>
      </PaperCard>

      {/* Map-hand block with city stamps */}
      <PaperCard shadow="soft" className="p-5 mb-5">
        <div className="mb-4">
          <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
            Carte de la communauté
          </p>
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5">
            Présence mondiale
          </h3>
        </div>
        <div
          className="map-hand paper relative w-full rounded-[4px] border border-[var(--ink-line)] overflow-hidden"
          style={{ height: 320, minHeight: 260 }}
        >
          {/* decorative grid lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(42,31,26,0.06)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* equator line */}
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(42,31,26,0.12)" strokeWidth="1" strokeDasharray="6 4" />
            {/* tropics */}
            <line x1="0" y1="38%" x2="100%" y2="38%" stroke="rgba(184,137,58,0.18)" strokeWidth="0.8" strokeDasharray="4 6" />
            <line x1="0" y1="62%" x2="100%" y2="62%" stroke="rgba(184,137,58,0.18)" strokeWidth="0.8" strokeDasharray="4 6" />
          </svg>

          {/* "continent" blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute rounded-[40%] bg-kraft-deep/8" style={{ left: "35%", top: "30%", width: "28%", height: "35%" }} />
            <div className="absolute rounded-[40%] bg-kraft-deep/8" style={{ left: "70%", top: "32%", width: "18%", height: "30%" }} />
            <div className="absolute rounded-[35%] bg-kraft-deep/6" style={{ left: "15%", top: "28%", width: "14%", height: "28%" }} />
            <div className="absolute rounded-[50%] bg-sea/12" style={{ left: "5%", top: "20%", width: "92%", height: "60%", zIndex: 0 }} />
          </div>

          {/* City stamps placed on map */}
          {CITY_EXTENDED.map((city) => {
            const isHigh = highlighted === city.city;
            const share = ((city.value / total) * 100).toFixed(1);
            return (
              <button
                key={city.city}
                onClick={() => setHighlighted(isHigh ? null : city.city)}
                className="absolute cursor-pointer group"
                style={{ left: `${city.x}%`, top: `${city.y}%`, transform: "translate(-50%, -50%)", zIndex: isHigh ? 20 : 10 }}
              >
                <Stamp
                  color={isHigh ? "gold" : city.value > 10000 ? "red" : city.value > 7000 ? "blue" : "green"}
                  shape="circle"
                  size={isHigh ? 60 : 44}
                  rotate={-5}
                  fontSize={isHigh ? 9 : 8}
                >
                  {`${city.flag}\n${city.city.slice(0, 6)}`}
                </Stamp>
                {isHigh && (
                  <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 bg-ink text-paper-warm rounded-[4px] px-2.5 py-1.5 text-[11px] font-[family-name:var(--font-type)] whitespace-nowrap shadow-lg z-30">
                    <div className="font-bold">{city.city} {city.flag}</div>
                    <div>{fmtNum(city.value)} sessions · {share}%</div>
                    <div className="text-gold-light">{city.growth}</div>
                  </div>
                )}
              </button>
            );
          })}

          <p className="absolute bottom-2 right-3 font-[family-name:var(--font-hand)] text-[13px] text-ink-faded italic pointer-events-none">
            Cliquez sur un tampon pour les détails ✦
          </p>
        </div>
      </PaperCard>

      {/* Ranked city table */}
      <PaperCard shadow="soft" className="p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
              Classement des destinations
            </p>
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5">
              Top villes
            </h3>
          </div>
          <div className="flex gap-2">
            <Chip color={sortMode === "volume" ? "ink" : "blue"} variant={sortMode === "volume" ? "filled" : "outline"} size="sm" mono onClick={() => setSortMode("volume")}>
              Volume
            </Chip>
            <Chip color={sortMode === "growth" ? "ink" : "blue"} variant={sortMode === "growth" ? "filled" : "outline"} size="sm" mono onClick={() => setSortMode("growth")}>
              Croissance
            </Chip>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] font-[family-name:var(--font-type)]">
            <thead>
              <tr className="border-b border-[var(--ink-line)]">
                {["Rang", "Ville", "Pays", "Sessions", "Part (%)", "Croissance"].map((h) => (
                  <th key={h} className="text-left pb-2 pr-3 text-ink-faded uppercase tracking-[0.08em] text-[10px] font-normal whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c, i) => {
                const share = ((c.value / total) * 100).toFixed(1);
                return (
                  <tr
                    key={c.city}
                    className="border-b border-[var(--ink-line)] last:border-0 hover:bg-paper-warm transition-colors cursor-pointer"
                    onClick={() => setHighlighted(highlighted === c.city ? null : c.city)}
                  >
                    <td className="py-2.5 pr-3">
                      {i === 0 ? <span className="text-gold-deep font-bold">①</span>
                        : i === 1 ? <span className="text-stamp-blue font-bold">②</span>
                        : i === 2 ? <span className="text-stamp-green font-bold">③</span>
                        : <span className="text-ink-faded">{i + 1}</span>}
                    </td>
                    <td className="py-2.5 pr-3 font-[family-name:var(--font-serif)] font-bold text-[13px]">
                      {c.flag} {c.city}
                    </td>
                    <td className="py-2.5 pr-3 text-ink-faded">{c.country}</td>
                    <td className="py-2.5 pr-3 font-bold">{fmtNum(c.value)}</td>
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-paper overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${(c.value / sorted[0].value) * 100}%`, background: i === 0 ? PALETTE.gold : PALETTE.blue }}
                          />
                        </div>
                        <span>{share}</span>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <Badge tone="green">{c.growth}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PaperCard>
    </AdminPage>
  );
}
