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
  ('Ana Torres', 'ana@comercialandina.pe', 'empresa'),
  ('Rosa Delgado', 'rrhh@lacenter.pe', 'empresa'),
  ('Marcos Silva', 'talento@logisticaexpress.pe', 'empresa'),
  ('Claudia Paredes', 'equipo@donjose.pe', 'empresa'),
  ('Valeria Salas', 'seleccion@clinicasanrafael.pe', 'empresa');

insert into public.perfiles_postulante (usuario_id, ubicacion, telefono, resumen, habilidades, experiencia, educacion)
select id, 'Lima', '999 111 222', 'Joven postulante con interes en atencion al cliente y ventas.', array['comunicacion', 'responsabilidad', 'excel basico'], 'Practicas y apoyo en tienda local.', 'Estudios tecnicos en curso'
from public.usuarios
where email = 'lucia@demo.com';

insert into public.empresas (usuario_id, nombre, rubro, descripcion, ubicacion)
select id, 'Comercial Andina', 'Retail', 'Cadena de tiendas de conveniencia enfocada en atencion cercana, orden de tienda y oportunidades para jovenes talentos.', 'Lima Centro'
from public.usuarios
where email = 'ana@comercialandina.pe';

insert into public.empresas (usuario_id, nombre, rubro, descripcion, ubicacion)
select id, 'Tiendas Lima Center', 'Ventas y retail', 'Empresa retail con sedes en Lima Este. Busca jovenes responsables para apoyar en reposicion, caja y atencion al cliente.', 'Ate'
from public.usuarios
where email = 'rrhh@lacenter.pe';

insert into public.empresas (usuario_id, nombre, rubro, descripcion, ubicacion)
select id, 'Logistica Express SAC', 'Logistica', 'Operador logistico local que brinda servicios de almacen, inventario y despacho para pequenos comercios.', 'La Molina'
from public.usuarios
where email = 'talento@logisticaexpress.pe';

insert into public.empresas (usuario_id, nombre, rubro, descripcion, ubicacion)
select id, 'Cevicheria Don Jose', 'Gastronomia', 'Restaurante familiar en Miraflores especializado en comida marina. Ofrece capacitacion inicial y buen ambiente de trabajo.', 'Miraflores'
from public.usuarios
where email = 'equipo@donjose.pe';

insert into public.empresas (usuario_id, nombre, rubro, descripcion, ubicacion)
select id, 'Clinica San Rafael', 'Salud', 'Centro medico privado con atencion ambulatoria. Requiere apoyo administrativo y recepcion para orientar pacientes.', 'San Isidro'
from public.usuarios
where email = 'seleccion@clinicasanrafael.pe';

insert into public.vacantes (empresa_id, titulo, modalidad, ubicacion, salario, descripcion, requisitos)
select id, 'Asistente de atencion al cliente', 'Presencial', 'Lima Centro', 'S/ 1200 - S/ 1500', 'Orientar clientes en tienda, registrar solicitudes simples y dar seguimiento a consultas frecuentes. La empresa brinda capacitacion inicial sobre productos, protocolo de atencion y uso basico del sistema.', array['Buen trato al cliente', 'Comunicacion clara', 'Disponibilidad inmediata', 'Manejo basico de computadora']
from public.empresas
where nombre = 'Comercial Andina';

insert into public.vacantes (empresa_id, titulo, modalidad, ubicacion, salario, descripcion, requisitos)
select id, 'Asistente de tienda part-time', 'Part-time', 'Ate', 'S/ 850', 'Apoyar en orden de productos, reposicion de anaqueles, atencion en piso de venta y apoyo en caja durante horas de mayor movimiento. Ideal para estudiantes con disponibilidad por la tarde.', array['Responsabilidad', 'Orden y puntualidad', 'Disponibilidad por la tarde', 'No requiere experiencia previa']
from public.empresas
where nombre = 'Tiendas Lima Center';

insert into public.vacantes (empresa_id, titulo, modalidad, ubicacion, salario, descripcion, requisitos)
select id, 'Auxiliar de almacen', 'Tiempo completo', 'La Molina', 'S/ 1100', 'Realizar conteo de productos, apoyo en recepcion de mercaderia, rotulado, preparacion de pedidos y mantenimiento del orden del almacen. Se ensena el flujo completo durante la primera semana.', array['Condicion fisica para trabajo operativo', 'Orden', 'Trabajo en equipo', 'Disponibilidad de lunes a sabado']
from public.empresas
where nombre = 'Logistica Express SAC';

insert into public.vacantes (empresa_id, titulo, modalidad, ubicacion, salario, descripcion, requisitos)
select id, 'Mozo junior', 'Part-time', 'Miraflores', 'S/ 900', 'Atender mesas, tomar pedidos, coordinar con cocina y apoyar en el cobro de cuentas. No se requiere experiencia previa; el equipo capacita en carta, protocolo de servicio y manejo de horarios.', array['Actitud de servicio', 'Buena comunicacion', 'Disponibilidad fines de semana', 'Ganas de aprender']
from public.empresas
where nombre = 'Cevicheria Don Jose';

insert into public.vacantes (empresa_id, titulo, modalidad, ubicacion, salario, descripcion, requisitos)
select id, 'Recepcionista junior', 'Presencial', 'San Isidro', 'S/ 1025', 'Recibir pacientes, orientar consultas, confirmar citas, registrar datos basicos y coordinar con las areas internas. Puesto recomendado para postulantes con trato amable y organizacion.', array['Trato amable', 'Orden administrativo', 'Comunicacion telefonica', 'Disponibilidad de lunes a viernes']
from public.empresas
where nombre = 'Clinica San Rafael';

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
where v.titulo = 'Mozo junior'
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
