-- ============================================================
-- Doboz Légzés – függvény jogosultságok szűkítése
-- Lefuttatva: 2026-08-24, Supabase MCP `apply_migration`.
--
-- A Supabase security linter jelezte, hogy a 0001-ben létrehozott
-- SECURITY DEFINER függvények a PostgREST-en keresztül bárki által
-- hívhatók (`/rest/v1/rpc/...`). Egyik sem publikus API, ezért az
-- alapértelmezett PUBLIC EXECUTE jogot visszavonjuk.
-- Lásd docs/feature-tasks.md – D-008.
-- ============================================================

-- Trigger függvény: soha nem kell közvetlenül hívni. A triggert a tábla
-- tulajdonosa hozta létre, így a trigger ettől még lefut.
revoke all on function public.breathing_create_default_settings() from public, anon, authenticated;

-- RLS segédfüggvény: az RLS policy kifejezés a lekérdező szerepében fut,
-- ezért a bejelentkezett felhasználónak KELL a hívási jog. Az anon
-- szerepnek nem — annak `auth.uid()` amúgy is null.
revoke all on function public.breathing_owns_child(uuid) from public, anon;
grant execute on function public.breathing_owns_child(uuid) to authenticated;
