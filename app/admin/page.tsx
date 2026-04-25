import { isAuthed } from "@/lib/admin";
import { readCustomItems } from "@/lib/kv";
import { LoginForm } from "./LoginForm";
import { Editor } from "./Editor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthed())) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <h1 className="mb-6 text-2xl font-semibold text-accent">Admin login</h1>
        <LoginForm />
      </main>
    );
  }

  const initialItems = await readCustomItems();
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Custom items</h1>
          <p className="text-sm text-neutral-400">
            Items here are merged into <span className="font-mono">/api/items</span>
            {" "}and shipped to the mod. Save commits the whole list.
          </p>
        </div>
      </header>
      <Editor initialItems={initialItems} />
    </main>
  );
}
