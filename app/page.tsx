import Image from "next/image";

const FEATURES = [
  {
    title: "Searchable market GUI",
    body: "When the Wynncraft market asks you to type an item name, the mod replaces the prompt with a fast, fuzzy search.",
  },
  {
    title: "No API key required",
    body: "Items are served from this site's daily-cached endpoint — your client never touches the Wynncraft API directly.",
  },
  {
    title: "Custom items",
    body: "Pin Corkian Amplifiers, Simulators, or any item you trade often via /wms add.",
  },
  {
    title: "Offline-friendly",
    body: "Each refresh is saved to disk and reused if the network is down.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <header className="flex items-center gap-4">
        <Image src="/icon.png" alt="WMS icon" width={56} height={56} className="rounded" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">WynnMarketSearch</h1>
          <p className="text-sm text-neutral-400">A Fabric mod for Wynncraft 1.21+</p>
        </div>
      </header>

      <section className="mt-10">
        <p className="text-lg leading-relaxed text-neutral-200">
          Replaces Wynncraft&rsquo;s market text prompt with a searchable GUI backed by an
          item database that refreshes twice a day.
        </p>
      </section>

      <section className="mt-10 overflow-hidden rounded-lg border border-neutral-800 bg-panel">
        <Image
          src="/screenshot.png"
          alt="In-game screenshot of the search GUI"
          width={1280}
          height={720}
          className="h-auto w-full"
          priority
        />
      </section>

      <section className="mt-12 grid gap-6 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-lg border border-neutral-800 bg-panel p-5">
            <h3 className="font-semibold text-accent">{f.title}</h3>
            <p className="mt-2 text-sm text-neutral-300">{f.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Install</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-neutral-300">
          <li>Install Fabric Loader for Minecraft 1.21.11.</li>
          <li>
            Drop <span className="font-mono text-accent">wms-*.jar</span>, Fabric API,
            Cloth Config, and Mod Menu into your <span className="font-mono">mods/</span> folder.
          </li>
          <li>Launch, join Wynncraft, and open any market prompt.</li>
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Commands</h2>
        <ul className="mt-3 space-y-1 font-mono text-sm text-neutral-300">
          <li><span className="text-accent">/wms open</span> &mdash; open the search GUI manually</li>
          <li><span className="text-accent">/wms add &lt;name&gt;</span> &mdash; pin a custom item</li>
          <li><span className="text-accent">/wms del &lt;name&gt;</span> &mdash; remove a custom item</li>
          <li><span className="text-accent">/wms list</span> &mdash; show pinned items</li>
          <li><span className="text-accent">/wms reload</span> &mdash; force a fresh fetch from this API</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">For developers</h2>
        <p className="mt-3 text-sm text-neutral-300">
          The slim item database is exposed at{" "}
          <a href="/api/items" className="font-mono">/api/items</a>. It returns only{" "}
          <span className="font-mono">displayName</span>,{" "}
          <span className="font-mono">tier</span>, and{" "}
          <span className="font-mono">icon</span> for each item, refreshed every 12 hours.
        </p>
      </section>

      <footer className="mt-16 border-t border-neutral-800 pt-6 text-xs text-neutral-500">
        Not affiliated with Wynncraft or Mojang.
      </footer>
    </main>
  );
}
