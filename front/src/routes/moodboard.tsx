import { createFileRoute } from "@tanstack/react-router";
import { AtelierLayout } from "@/components/atelier-layout";
import moodDenim from "@/assets/mood-denim.jpg";
import moodAtelier from "@/assets/mood-atelier.jpg";
import moodConcrete from "@/assets/mood-concrete.jpg";
import { useMoodBoards } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { userName } from "@/lib/labels";

export const Route = createFileRoute("/moodboard")({
  head: () => ({
    meta: [
      { title: "Mood Board — Denim House R&D" },
      {
        name: "description",
        content: "Visual references, color palettes and atmosphere studies for the season.",
      },
    ],
  }),
  component: Mood,
});

function Mood() {
  const { data: boards = [], isLoading } = useMoodBoards();
  const { user } = useAuth();
  const board = boards[0];

  if (isLoading) {
    return (
      <AtelierLayout eyebrow="Workspace / Atmosphere" title="Mood Board">
        <p className="font-mono text-sm text-charcoal/50">Loading mood boards…</p>
      </AtelierLayout>
    );
  }

  if (!board) {
    return (
      <AtelierLayout eyebrow="Workspace / Atmosphere" title="Mood Board">
        <p className="font-mono text-sm text-charcoal/50">No mood boards yet.</p>
      </AtelierLayout>
    );
  }

  const imgs = board.images.length
    ? board.images
    : [{ url: moodDenim, caption: "Default" }, { url: moodAtelier }, { url: moodConcrete }];

  return (
    <AtelierLayout
      eyebrow="Workspace / Atmosphere"
      title={`${board.collection ?? board.title} Mood`}
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 row-span-2">
          <figure className="relative overflow-hidden border border-charcoal/10">
            <img
              src={imgs[0]?.url ?? moodDenim}
              alt={imgs[0]?.caption ?? board.title}
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 flex items-end justify-between bg-gradient-to-t from-charcoal/80 to-transparent p-6 text-canvas">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest opacity-70">
                  {board.title}
                </p>
                <p className="font-serif text-2xl italic">{board.collection ?? "Collection"}</p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">
                DH-MOOD
              </span>
            </figcaption>
          </figure>
        </div>

        <div className="col-span-6 lg:col-span-4">
          <img
            src={imgs[1]?.url ?? moodAtelier}
            alt=""
            className="aspect-square w-full object-cover border border-charcoal/10"
          />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <img
            src={imgs[2]?.url ?? moodConcrete}
            alt=""
            className="aspect-square w-full object-cover border border-charcoal/10"
          />
        </div>

        <div className="col-span-12 lg:col-span-6 bg-card border border-charcoal/10 p-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/50 mb-3">
            Color story
          </p>
          <div className="grid grid-cols-5 gap-2">
            {(board.colors.length
              ? board.colors
              : [{ hex: "#1B2B48" }, { hex: "#FAF9F6" }, { hex: "#D97706" }]
            ).map((c) => (
              <div key={c.hex}>
                <div className="aspect-square" style={{ backgroundColor: c.hex }} />
                <p className="mt-2 font-mono text-[9px] uppercase tracking-widest text-charcoal/60">
                  {c.hex}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 bg-indigo-dye text-canvas p-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-canvas/60 mb-3">
            Direction note
          </p>
          <blockquote className="font-serif text-xl italic leading-snug">
            &ldquo;An archive that walks — raw selvedge cut against ecru paper, lit like a Robert
            Frank print. Copper thread is the only ornament.&rdquo;
          </blockquote>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-canvas/50">
            — {user ? userName(user) : "Creative Director"}
          </p>
        </div>
      </div>
    </AtelierLayout>
  );
}
