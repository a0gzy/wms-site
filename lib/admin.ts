import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "wms-admin";

/**
 * Time-safe сравнение строк одинаковой длины. Возвращает {@code false}
 * если длины отличаются — без побайтового короткого замыкания.
 */
export function safeEqual(a: string | undefined, b: string | undefined): boolean {
  if (!a || !b) return false;
  const ab = Buffer.from(a, "utf-8");
  const bb = Buffer.from(b, "utf-8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Проверяет, что текущий запрос имеет валидную админ-куку. */
export async function isAuthed(): Promise<boolean> {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) return false;
  const jar = await cookies();
  return safeEqual(jar.get(ADMIN_COOKIE)?.value, expected);
}
