-- WorkBridge - Base de datos provisional para TB4
-- Pegar este archivo en Supabase SQL Editor y ejecutar con Run.

create extension if not exists pgcrypto;

drop table if exists public.mensajes cascade;
drop table if exists public.guardados cascade;
drop table if exists public.postulaciones cascade;
drop table if exists public.vacantes cascade;
drop table if exists public.empresas cascade;
drop table if exists public.perfiles_postulante cascade;
drop table if exists public.usuarios cascade;

create table public.usuarios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text unique not null,
  rol text not null check (rol in ('postulante', 'empresa')),
  creado_en timestamptz not null default now()
);

create table public.perfiles_postulante (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  ubicacion text,
  telefono text,
  resumen text,
  habilidades text[] not null default '{}',
  experiencia text,
  educacion text,
  actualizado_en timestamptz not null default now()
);

create table public.empresas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete set null,
  nombre text not null,
  rubro text,
  descripcion text,
  ubicacion text,
  creado_en timestamptz not null default now()
);

create table public.vacantes (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  titulo text not null,
  modalidad text not null default 'Presencial',
  ubicacion text not null default 'Lima',
  salario text,
  descripcion text not null,
  requisitos text[] not null default '{}',
  estado text not null default 'activa' check (estado in ('activa', 'cerrada', 'borrador')),
  creado_en timestamptz not null default now()
);

create table public.postulaciones (
  id uuid primary key default gen_random_uuid(),
  vacante_id uuid not null references public.vacantes(id) on delete cascade,
  postulante_id uuid not null references public.usuarios(id) on delete cascade,
  estado text not null default 'enviada' check (estado in ('enviada', 'en_revision', 'entrevista', 'rechazada', 'aceptada')),
  mensaje text,
  creado_en timestamptz not null default now(),
  unique (vacante_id, postulante_id)
);

create table public.guardados (
  id uuid primary key default gen_random_uuid(),
  vacante_id uuid not null references public.vacantes(id) on delete cascade,
  postulante_id uuid not null references public.usuarios(id) on delete cascade,
  creado_en timestamptz not null default now(),
  unique (vacante_id, postulante_id)
);

create table public.mensajes (
  id uuid primary key default gen_random_uuid(),
  postulacion_id uuid references public.postulaciones(id) on delete cascade,
  remitente_id uuid references public.usuarios(id) on delete set null,
  contenido text not null,
  creado_en timestamptz not null default now()
);

insert into public.usuarios (nombre, email, rol) values
  ('Lucia Ramos', 'lucia@demo.com', 'postulante'),
  ('Carlos Vega', 'carlos@demo.com', 'postulante'),
  ('Ana Torres', 'ana@workbridge.com', 'empresa');

insert into public.perfiles_postulante (usuario_id, ubicacion, telefono, resumen, habilidades, experiencia, educacion)
select id, 'Lima', '999 111 222', 'Joven postulante con interes en atencion al cliente y ventas.', array['comunicacion', 'responsabilidad', 'excel basico'], 'Practicas y apoyo en tienda local.', 'Estudios tecnicos en curso'
from public.usuarios
where email = 'lucia@demo.com';

insert into public.empresas (usuario_id, nombre, rubro, descripcion, ubicacion)
select id, 'Comercial Andina', 'Retail', 'Empresa peruana con oportunidades para jovenes talentos.', 'Lima'
from public.usuarios
where email = 'ana@workbridge.com';

insert into public.vacantes (empresa_id, titulo, modalidad, ubicacion, salario, descripcion, requisitos)
select id, 'Asistente de atencion al cliente', 'Presencial', 'Lima Centro', 'S/ 1200 - S/ 1500', 'Apoyo en orientacion a clientes, registro de solicitudes y seguimiento de casos.', array['Buen trato', 'Disponibilidad inmediata', 'Manejo basico de computadora']
from public.empresas
where nombre = 'Comercial Andina';

insert into public.vacantes (empresa_id, titulo, modalidad, ubicacion, salario, descripcion, requisitos)
select id, 'Practicante de soporte administrativo', 'Hibrido', 'San Isidro', 'S/ 1025', 'Soporte en tareas administrativas, archivo digital y coordinacion interna.', array['Organizacion', 'Excel basico', 'Comunicacion']
from public.empresas
where nombre = 'Comercial Andina';

insert into public.postulaciones (vacante_id, postulante_id, estado, mensaje)
select v.id, u.id, 'en_revision', 'Estoy interesado en la vacante y cuento con disponibilidad inmediata.'
from public.vacantes v
cross join public.usuarios u
where v.titulo = 'Asistente de atencion al cliente'
  and u.email = 'lucia@demo.com';

insert into public.guardados (vacante_id, postulante_id)
select v.id, u.id
from public.vacantes v
cross join public.usuarios u
where v.titulo = 'Practicante de soporte administrativo'
  and u.email = 'lucia@demo.com';

alter table public.usuarios enable row level security;
alter table public.perfiles_postulante enable row level security;
alter table public.empresas enable row level security;
alter table public.vacantes enable row level security;
alter table public.postulaciones enable row level security;
alter table public.guardados enable row level security;
alter table public.mensajes enable row level security;

create policy "lectura publica usuarios demo" on public.usuarios
  for select to anon using (true);
create policy "lectura publica perfiles demo" on public.perfiles_postulante
  for select to anon using (true);
create policy "lectura publica empresas demo" on public.empresas
  for select to anon using (true);
create policy "lectura publica vacantes demo" on public.vacantes
  for select to anon using (true);
create policy "lectura publica postulaciones demo" on public.postulaciones
  for select to anon using (true);
create policy "lectura publica guardados demo" on public.guardados
  for select to anon using (true);
create policy "lectura publica mensajes demo" on public.mensajes
  for select to anon using (true);

create policy "insert demo postulaciones" on public.postulaciones
  for insert to anon with check (true);
create policy "insert demo guardados" on public.guardados
  for insert to anon with check (true);
create policy "insert demo mensajes" on public.mensajes
  for insert to anon with check (true);
