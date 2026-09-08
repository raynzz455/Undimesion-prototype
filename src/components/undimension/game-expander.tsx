"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Users, Image as ImageIcon, Sword, Shield, Crown, MapPin } from "lucide-react";
import { GAME_DETAILS, MEMBER_DND_STATS, DND_STAT_LABELS, type DnDStats } from "@/lib/undimension/game-details";
import { cn } from "@/lib/utils";
import { useSfx } from "@/hooks/use-sfx";

function statModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : String(mod);
}

function DnDStatBlock({ stats, color }: { stats: DnDStats; color: string }) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
      {(Object.keys(stats) as (keyof DnDStats)[]).map((key) => {
        const val = stats[key];
        const info = DND_STAT_LABELS[key];
        return (
          <div
            key={key}
            className="border-2 border-black dark:border-white bg-black dark:bg-white text-center p-2 group relative"
            style={{ borderTopColor: color, borderTopWidth: "4px" }}
          >
            <div className="font-bebas text-2xl text-white dark:text-black leading-none">{key}</div>
            <div className="font-bebas text-4xl leading-none my-1" style={{ color }}>{val}</div>
            <div className="font-mono-ud text-[9px] text-white/50 dark:text-black/50">{statModifier(val)}</div>
            <div className="absolute hidden group-hover:block z-50 bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black text-white text-[9px] font-mono-ud p-2 border border-white whitespace-nowrap max-w-[200px] normal-case">
              <span className="font-bold" style={{ color }}>{info.full}</span>
              <br />
              {info.desc}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PlayerChip({ p }: { p: { nick: string; color: string; img: string; role?: string; favHero?: string; rank?: string; kda?: string; winRate?: string; dndCharacter?: string; dndRace?: string; dndClass?: string; dndLevel?: number; dndCharacterImg?: string } }) {
  return (
    <div className="border-2 border-black dark:border-white bg-white dark:bg-[#1a1a1a] p-2 flex items-center gap-2">
      <img src={p.img} alt={p.nick} className="w-10 h-10 object-cover border-2 border-black dark:border-white grayscale" loading="lazy" />
      <div className="flex-1 min-w-0">
        <div className="font-bebas text-lg leading-none" style={{ color: p.color }}>{p.nick}</div>
        {p.role && <div className="font-mono-ud text-[9px] text-black/60 dark:text-white/60">{p.role} · {p.favHero}</div>}
        {p.dndCharacter && <div className="font-mono-ud text-[9px] text-black/60 dark:text-white/60">{p.dndCharacter}</div>}
      </div>
      {p.rank && <div className="font-mono-ud text-[9px] font-black text-right"><div className="text-[#d4ff00]">{p.rank}</div><div className="text-black/50 dark:text-white/50">WR: {p.winRate}</div></div>}
      {p.dndLevel && <div className="font-bebas text-2xl" style={{ color: p.color }}>LVL {p.dndLevel}</div>}
    </div>
  );
}

export function GameExpander({ gameId, accent }: { gameId: string; accent: string }) {
  const [open, setOpen] = useState(false);
  const { play } = useSfx();
  const detail = GAME_DETAILS[gameId];

  if (!detail) return null;

  return (
    <div className="mt-6">
      <button
        onClick={() => { play("click"); setOpen((o) => !o); }}
        className={cn(
          "w-full flex items-center justify-between px-4 py-2 border-4 border-black dark:border-white font-bebas text-lg md:text-xl tracking-wider transition-all no-color-transition",
          open ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white/10 text-white hover:bg-white/20",
        )}
      >
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4" /> EXPAND DETAILS
          {detail.players.length > 0 && <span className="font-mono-ud text-[10px] opacity-60">({detail.players.length} PLAYERS)</span>}
        </span>
        <ChevronDown className={cn("w-5 h-5 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-4 border-black dark:border-white bg-[#09090b] dark:bg-[#1a1a1a] p-4 mt-2 space-y-4">
              {/* Players */}
              <div>
                <h4 className="font-bebas text-2xl text-white dark:text-black mb-2 flex items-center gap-2 border-b-2 border-white/20 dark:border-black/20 pb-1">
                  <Users className="w-5 h-5" style={{ color: accent }} /> PLAYERS ({detail.players.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {detail.players.map((p, i) => (
                    <PlayerChip key={i} p={p} />
                  ))}
                </div>
              </div>

              {/* ML Pro Player Stats */}
              {gameId === "ml" && detail.teamStats && (
                <div>
                  <h4 className="font-bebas text-2xl text-white dark:text-black mb-2 flex items-center gap-2 border-b-2 border-white/20 dark:border-black/20 pb-1">
                    <Sword className="w-5 h-5" style={{ color: accent }} /> TEAM STATS
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="border-2 border-white/30 p-2 text-center">
                      <div className="font-bebas text-3xl" style={{ color: accent }}>{detail.teamStats.rank}</div>
                      <div className="font-mono-ud text-[9px] text-white/50">RANK</div>
                    </div>
                    <div className="border-2 border-white/30 p-2 text-center">
                      <div className="font-bebas text-3xl" style={{ color: accent }}>{detail.teamStats.winRate}</div>
                      <div className="font-mono-ud text-[9px] text-white/50">WIN RATE</div>
                    </div>
                    <div className="border-2 border-white/30 p-2 text-center">
                      <div className="font-bebas text-3xl" style={{ color: accent }}>{detail.teamStats.totalMatches}</div>
                      <div className="font-mono-ud text-[9px] text-white/50">MATCHES</div>
                    </div>
                    <div className="border-2 border-white/30 p-2 text-center">
                      <div className="font-bebas text-xl" style={{ color: accent }}>{detail.teamStats.favoriteComp}</div>
                      <div className="font-mono-ud text-[9px] text-white/50">FAV COMP</div>
                    </div>
                  </div>
                  {/* Individual ML stats */}
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full font-mono-ud text-[10px] text-white border-collapse">
                      <thead>
                        <tr className="border-b-2 border-white/30">
                          <th className="text-left py-1 px-2">PLAYER</th>
                          <th className="text-center py-1 px-2">ROLE</th>
                          <th className="text-center py-1 px-2">HERO</th>
                          <th className="text-center py-1 px-2">RANK</th>
                          <th className="text-center py-1 px-2">KDA</th>
                          <th className="text-center py-1 px-2">WR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.players.map((p, i) => (
                          <tr key={i} className="border-b border-white/10">
                            <td className="py-1 px-2 font-bold" style={{ color: p.color }}>{p.nick}</td>
                            <td className="text-center py-1 px-2">{p.role}</td>
                            <td className="text-center py-1 px-2">{p.favHero}</td>
                            <td className="text-center py-1 px-2 text-[#d4ff00]">{p.rank}</td>
                            <td className="text-center py-1 px-2">{p.kda}</td>
                            <td className="text-center py-1 px-2">{p.winRate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Moments / Gallery (not for D&D) */}
              {detail.moments && detail.moments.length > 0 && (
                <div>
                  <h4 className="font-bebas text-2xl text-white dark:text-black mb-2 flex items-center gap-2 border-b-2 border-white/20 dark:border-black/20 pb-1">
                    <ImageIcon className="w-5 h-5" style={{ color: accent }} /> MOMENTS ({detail.moments.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {detail.moments.map((m, i) => (
                      <div key={i} className="border-2 border-white/20 overflow-hidden">
                        <div className="relative aspect-video">
                          <img src={m.img} alt={m.title} className="w-full h-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 ud-scanlines opacity-20" />
                        </div>
                        <div className="p-2">
                          <div className="font-bebas text-lg" style={{ color: accent }}>{m.title}</div>
                          <div className="font-mono-ud text-[9px] text-white/50">{m.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* D&D: Campaigns + Characters + Story + Locations */}
              {gameId === "dnd" && (
                <>
                  {/* D&D Character Cards */}
                  <div>
                    <h4 className="font-bebas text-2xl text-white dark:text-black mb-2 flex items-center gap-2 border-b-2 border-white/20 dark:border-black/20 pb-1">
                      <Crown className="w-5 h-5" style={{ color: accent }} /> CHARACTERS
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {detail.players.map((p, i) => (
                        <div key={i} className="border-2 border-white/20 overflow-hidden">
                          {p.dndCharacterImg && (
                            <div className="relative aspect-square">
                              <img src={p.dndCharacterImg} alt={p.dndCharacter} className="w-full h-full object-cover grayscale" loading="lazy" />
                              <div className="absolute inset-0 ud-scanlines opacity-30" />
                            </div>
                          )}
                          <div className="p-3 bg-black">
                            <div className="font-bebas text-xl" style={{ color: p.color }}>{p.dndCharacter}</div>
                            <div className="font-mono-ud text-[9px] text-white/60">{p.dndRace} · {p.dndClass}</div>
                            <div className="font-bebas text-2xl mt-1" style={{ color: p.color }}>LVL {p.dndLevel}</div>
                            {/* D&D Stats */}
                            {p.memberId && MEMBER_DND_STATS[p.memberId] && (
                              <div className="mt-2 pt-2 border-t border-white/10">
                                <DnDStatBlock stats={MEMBER_DND_STATS[p.memberId]} color={p.color} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* D&D Campaigns */}
                  {detail.campaigns && (
                    <div>
                      <h4 className="font-bebas text-2xl text-white dark:text-black mb-2 flex items-center gap-2 border-b-2 border-white/20 dark:border-black/20 pb-1">
                        <Shield className="w-5 h-5" style={{ color: accent }} /> CAMPAIGNS ({detail.campaigns.length})
                      </h4>
                      <div className="space-y-3">
                        {detail.campaigns.map((c) => (
                          <div key={c.id} className="border-2 border-white/20 p-3">
                            <div className="flex items-baseline justify-between gap-2 flex-wrap mb-1">
                              <span className="font-bebas text-xl text-white">{c.name}</span>
                              <span className={cn(
                                "font-mono-ud text-[9px] font-black px-2 py-0.5 border",
                                c.status === "ONGOING" ? "text-[#00ff00] border-[#00ff00]" :
                                c.status === "COMPLETED" ? "text-[#00e5ff] border-[#00e5ff]" :
                                "text-[#ff8c00] border-[#ff8c00]",
                              )}>{c.status}</span>
                            </div>
                            <div className="font-mono-ud text-[10px] text-white/50 mb-1">DM: {c.dm} · {c.sessions} sessions</div>
                            <p className="font-mono-ud text-[10px] text-white/70 leading-relaxed mb-2">{c.description}</p>
                            {c.locationImages && c.locationImages.length > 0 && (
                              <div className="flex gap-1">
                                {c.locationImages.map((img, i) => (
                                  <img key={i} src={img} alt={`Location ${i+1}`} className="w-16 h-16 object-cover border border-white/20" loading="lazy" />
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* D&D Story Outline */}
                  {detail.storyOutline && (
                    <div>
                      <h4 className="font-bebas text-2xl text-white dark:text-black mb-2 flex items-center gap-2 border-b-2 border-white/20 dark:border-black/20 pb-1">
                        <MapPin className="w-5 h-5" style={{ color: accent }} /> STORY OUTLINE
                      </h4>
                      <div className="border-2 border-white/20 bg-black p-3">
                        <p className="font-mono-ud text-xs text-white/70 leading-relaxed">{detail.storyOutline}</p>
                      </div>
                    </div>
                  )}

                  {/* D&D Location Photos */}
                  {detail.locationImages && detail.locationImages.length > 0 && (
                    <div>
                      <h4 className="font-bebas text-2xl text-white dark:text-black mb-2 flex items-center gap-2 border-b-2 border-white/20 dark:border-black/20 pb-1">
                        <ImageIcon className="w-5 h-5" style={{ color: accent }} /> LOCATION PHOTOS
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {detail.locationImages.map((img, i) => (
                          <div key={i} className="border-2 border-white/20 overflow-hidden">
                            <img src={img} alt={`Location ${i+1}`} className="w-full aspect-square object-cover" loading="lazy" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
