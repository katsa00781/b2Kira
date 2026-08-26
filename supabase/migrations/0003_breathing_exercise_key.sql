-- ============================================================
-- Doboz Légzés app – melyik gyakorlat volt?
-- Projekt: familyBudget (eguhipjgnhbajbmnrskm)
--
-- A logopédus lapja négy gyakorlatot ad fel (docs/legzogyakorlatok-2026-08-26.md),
-- az app eddig csak a doboz légzést ismerte. A session sorokból ezután kiderül,
-- melyik gyakorlatot végezte a gyerek.
--
-- A régi sorok mind doboz légzések, ezért az alapérték 'box'.
-- Lásd docs/feature-tasks.md – D-057.
-- ============================================================

alter table public.breathing_sessions
  add column if not exists exercise_key text not null default 'box';

comment on column public.breathing_sessions.exercise_key is
  'box = doboz légzés (4-4-4-4) · nose-mouth = orr/száj kombinációk ·
   weekdays = a hét napjai egy levegővel · syllables = szótagsorok egy levegővel.
   A gyakorlatok katalógusa a kliensben van (data/exercises.ts).';

alter table public.breathing_sessions
  drop constraint if exists breathing_sessions_exercise_key_check;

alter table public.breathing_sessions
  add constraint breathing_sessions_exercise_key_check
    check (exercise_key in ('box', 'nose-mouth', 'weekdays', 'syllables'));
