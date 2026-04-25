import { cookies } from "next/headers";

export const ADMIN_COOKIE = "wms-admin";

/** Проверяет, что текущий запрос имеет валидную админ-куку. */
export async function isAuthed(): Promise<boolean> {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) return false;
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === expected;
}
