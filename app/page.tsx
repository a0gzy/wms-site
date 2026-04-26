import Image from "next/image";

const MODRINTH = "https://modrinth.com/mod/wynnmarketsearch";
const GITHUB = "https://github.com/a0gzy/WynnMarketSearch";

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant search GUI",
    body: "When the market asks for an item name, you get a live, fuzzy search instead of typing into chat.",
  },
  {
    icon: "★",
    title: "Favorites & pinned slots",
    body: "Star the items you trade often. Pin up to 18 to a hotbar-style strip — one click sends them.",
  },
  {
    icon: "↺",
    title: "History at hand",
    body: "Last 20 sent queries are right there in the side panel. Click to re-send, never retype.",
  },
  {
    icon: "🔒",
    title: "No API keys for you",
    body: "Items come from this site's daily-cached endpoint. The Wynncraft key never ships to the client.",
  },
];

const COMMANDS: [string, string][] = [
  ["/wms",            "open the GUI manually"],
  ["/wms add <name>", "add a personal custom item"],
  ["/wms del <name>", "remove one"],
  ["/wms list",       "list personal customs"],
  ["/wms reload",     "force a fresh fetch from this API"],
];

const CONTROLS: [string, string][] = [
  ["LMB on result",  "send to chat"],
  ["RMB on result",  "pin to bottom slot"],
  ["MMB on result",  "favorite (★)"],
  ["LMB on slot/history", "re-send"],
  ["RMB on slot/history", "remove"],
  ["Enter",          "send typed text"],
  ["ESC",            "cancel"],
];

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      {/* фоновая «аура» */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="aura absolute -top-40 left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(255,204,51,.06), transparent 35%), radial-gradient(circle at 80% 60%, rgba(120,180,255,.05), transparent 40%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#ffcc33 1px, transparent 1px), linear-gradient(90deg, #ffcc33 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* hero */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-20 text-center sm:pt-28">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl mc-panel">
          <Image src="/icon.png" alt="WMS" width={48} height={48} className="mc-pixel" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Wynn<span className="text-accent">Market</span>Search
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
          A Fabric mod that replaces Wynncraft&rsquo;s market chat search with a fast,
          searchable GUI &mdash; with favorites, pinned slots, and search history.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={MODRINTH}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
              <path d="M5.06 6.6a10 10 0 0 1 16.86 7.34l-2 .35a8 8 0 0 0-13.4-5.91l-1.46-1.78ZM2.08 9.7a10 10 0 0 0 16.86 9.06l-1.46-1.78a8 8 0 0 1-13.4-7.21l-2-.07Zm9.92 7.3a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
            </svg>
            Get on Modrinth
          </a>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-panel px-5 py-2.5 text-sm font-semibold hover:border-accent"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1.16-.02-2.1-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.7 5.36-5.27 5.65.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
            </svg>
            Source on GitHub
          </a>
        </div>

        <p className="mt-4 text-xs text-neutral-500">
          Minecraft <span className="font-mono text-neutral-400">1.21.11</span> · Fabric · client-side · no API keys for users
        </p>
      </section>

      {/* screenshot */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="overflow-hidden rounded-2xl mc-panel">
          <Image
            src="/screenshot.png"
            alt="In-game screenshot of the search GUI"
            width={1280}
            height={720}
            className="h-auto w-full"
            priority
          />
        </div>
      </section>

      {/* features */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="mb-8 text-center text-2xl font-semibold sm:text-3xl">What&rsquo;s in the box</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl mc-panel p-6 transition hover:border-accent/60">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-2xl">
                <span aria-hidden>{f.icon}</span>
              </div>
              <h3 className="font-semibold text-accent">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-300">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* controls */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="mb-8 text-center text-2xl font-semibold sm:text-3xl">Controls</h2>
        <div className="overflow-hidden rounded-xl mc-panel">
          <table className="w-full text-sm">
            <tbody>
              {CONTROLS.map(([key, action], i) => (
                <tr key={key} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                  <td className="w-1/2 px-5 py-3 font-mono text-accent sm:w-1/3">{key}</td>
                  <td className="px-5 py-3 text-neutral-300">{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* install */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="mb-8 text-center text-2xl font-semibold sm:text-3xl">Install</h2>
        <ol className="mx-auto max-w-2xl space-y-4">
          {[
            <>Install <span className="font-mono text-accent">Fabric Loader</span> for Minecraft 1.21.11.</>,
            <>Drop the WMS jar plus <a href="https://modrinth.com/mod/fabric-api" target="_blank" rel="noreferrer">Fabric API</a>, <a href="https://modrinth.com/mod/cloth-config" target="_blank" rel="noreferrer">Cloth Config</a>, and (optional) <a href="https://modrinth.com/mod/modmenu" target="_blank" rel="noreferrer">Mod Menu</a> into your <span className="font-mono">mods/</span> folder.</>,
            <>Launch, join Wynncraft, open any market prompt &mdash; the GUI takes over from there.</>,
          ].map((step, i) => (
            <li key={i} className="flex gap-4 rounded-xl mc-panel p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-black">
                {i + 1}
              </span>
              <p className="text-sm text-neutral-200">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* commands */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="mb-8 text-center text-2xl font-semibold sm:text-3xl">Commands</h2>
        <div className="overflow-hidden rounded-xl mc-panel">
          <table className="w-full text-sm">
            <tbody>
              {COMMANDS.map(([cmd, desc], i) => (
                <tr key={cmd} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                  <td className="w-1/2 px-5 py-3 font-mono text-accent sm:w-1/3">{cmd}</td>
                  <td className="px-5 py-3 text-neutral-300">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* dev */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-xl mc-panel p-6 sm:p-8">
          <h2 className="text-xl font-semibold">For developers</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-300">
            The slim item database is exposed at{" "}
            <a href="/api/items" className="font-mono">/api/items</a>. Each entry has only{" "}
            <span className="font-mono text-accent">displayName</span>,{" "}
            <span className="font-mono text-accent">tier</span>, and{" "}
            <span className="font-mono text-accent">icon</span> &mdash; refreshed twice a day.
            Self-host? Override the <span className="font-mono">apiUrl</span> setting in Mod Menu
            and point the mod at your own backend.
          </p>
        </div>
      </section>

      <footer className="border-t border-neutral-900 py-8 text-center text-xs text-neutral-500">
        Not affiliated with Wynncraft or Mojang ·{" "}
        <a href={GITHUB + "/issues"} target="_blank" rel="noreferrer">Report an issue</a>
      </footer>
    </main>
  );
}
