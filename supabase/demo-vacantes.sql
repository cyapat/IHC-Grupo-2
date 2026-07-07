-- WorkBridge - Vacantes demo mejoradas
-- Ejecutar en Supabase SQL Editor para reemplazar las vacantes demo actuales.

delete from public.mensajes;
delete from public.guardados;
delete from public.postulaciones;
delete from public.vacantes;
delete from public.empresas;
delete from public.usuarios where rol = 'empresa';

insert into public.usuarios (nombre, email, rol) values
  ('Ana Torres', 'ana@comercialandina.pe', 'empresa'),
  ('Rosa Delgado', 'rrhh@lacenter.pe', 'empresa'),
  ('Marcos Silva', 'talento@logisticaexpress.pe', 'empresa'),
  ('Claudia Paredes', 'equipo@donjose.pe', 'empresa'),
  ('Valeria Salas', 'seleccion@clinicasanrafael.pe', 'empresa')
on conflict (email) do update set
  nombre = excluded.nombre,
  rol = excluded.rol;

insert into public.empresas (usuario_id, nombre, rubro, descripcion, ubicacion)
select u.id, 'Comercial Andina', 'Retail',
  'Cadena de tiendas de conveniencia enfocada en atencion cercana, orden de tienda y oportunidades para jovenes talentos.',
  'Lima Centro'
from public.usuarios u
where u.email = 'ana@comercialandina.pe';

insert into public.empresas (usuario_id, nombre, rubro, descripcion, ubicacion)
select u.id, 'Tiendas Lima Center', 'Ventas y retail',
  'Empresa retail con sedes en Lima Este. Busca jovenes responsables para apoyar en reposicion, caja y atencion al cliente.',
  'Ate'
from public.usuarios u
where u.email = 'rrhh@lacenter.pe';

insert into public.empresas (usuario_id, nombre, rubro, descripcion, ubicacion)
select u.id, 'Logistica Express SAC', 'Logistica',
  'Operador logistico local que brinda servicios de almacen, inventario y despacho para pequenos comercios.',
  'La Molina'
from public.usuarios u
where u.email = 'talento@logisticaexpress.pe';

insert into public.empresas (usuario_id, nombre, rubro, descripcion, ubicacion)
select u.id, 'Cevicheria Don Jose', 'Gastronomia',
  'Restaurante familiar en Miraflores especializado en comida marina. Ofrece capacitacion inicial y buen ambiente de trabajo.',
  'Miraflores'
from public.usuarios u
where u.email = 'equipo@donjose.pe';

insert into public.empresas (usuario_id, nombre, rubro, descripcion, ubicacion)
select u.id, 'Clinica San Rafael', 'Salud',
  'Centro medico privado con atencion ambulatoria. Requiere apoyo administrativo y recepcion para orientar pacientes.',
  'San Isidro'
from public.usuarios u
where u.email = 'seleccion@clinicasanrafael.pe';

insert into public.vacantes (empresa_id, titulo, modalidad, ubicacion, salario, descripcion, requisitos)
select e.id,
  'Asistente de atencion al cliente',
  'Presencial',
  'Lima Centro',
  'S/ 1200 - S/ 1500',
  'Orientar clientes en tienda, registrar solicitudes simples y dar seguimiento a consultas frecuentes. La empresa brinda capacitacion inicial sobre productos, protocolo de atencion y uso basico del sistema.',
  array['Buen trato al cliente', 'Comunicacion clara', 'Disponibilidad inmediata', 'Manejo basico de computadora']
from public.empresas e
where e.nombre = 'Comercial Andina';

insert into public.vacantes (empresa_id, titulo, modalidad, ubicacion, salario, descripcion, requisitos)
select e.id,
  'Asistente de tienda part-time',
  'Part-time',
  'Ate',
  'S/ 850',
  'Apoyar en orden de productos, reposicion de anaqueles, atencion en piso de venta y apoyo en caja durante horas de mayor movimiento. Ideal para estudiantes con disponibilidad por la tarde.',
  array['Responsabilidad', 'Orden y puntualidad', 'Disponibilidad por la tarde', 'No requiere experiencia previa']
from public.empresas e
where e.nombre = 'Tiendas Lima Center';

insert into public.vacantes (empresa_id, titulo, modalidad, ubicacion, salario, descripcion, requisitos)
select e.id,
  'Auxiliar de almacen',
  'Tiempo completo',
  'La Molina',
  'S/ 1100',
  'Realizar conteo de productos, apoyo en recepcion de mercaderia, rotulado, preparacion de pedidos y mantenimiento del orden del almacen. Se ensena el flujo completo durante la primera semana.',
  array['Condicion fisica para trabajo operativo', 'Orden', 'Trabajo en equipo', 'Disponibilidad de lunes a sabado']
from public.empresas e
where e.nombre = 'Logistica Express SAC';

insert into public.vacantes (empresa_id, titulo, modalidad, ubicacion, salario, descripcion, requisitos)
select e.id,
  'Mozo junior',
  'Part-time',
  'Miraflores',
  'S/ 900',
  'Atender mesas, tomar pedidos, coordinar con cocina y apoyar en el cobro de cuentas. No se requiere experiencia previa; el equipo capacita en carta, protocolo de servicio y manejo de horarios.',
  array['Actitud de servicio', 'Buena comunicacion', 'Disponibilidad fines de semana', 'Ganas de aprender']
from public.empresas e
where e.nombre = 'Cevicheria Don Jose';

insert into public.vacantes (empresa_id, titulo, modalidad, ubicacion, salario, descripcion, requisitos)
select e.id,
  'Recepcionista junior',
  'Presencial',
  'San Isidro',
  'S/ 1025',
  'Recibir pacientes, orientar consultas, confirmar citas, registrar datos basicos y coordinar con las areas internas. Puesto recomendado para postulantes con trato amable y organizacion.',
  array['Trato amable', 'Orden administrativo', 'Comunicacion telefonica', 'Disponibilidad de lunes a viernes']
from public.empresas e
where e.nombre = 'Clinica San Rafael';

insert into public.postulaciones (vacante_id, postulante_id, estado, mensaje)
select v.id, u.id, 'en_revision', 'Estoy interesado en la vacante y cuento con disponibilidad inmediata.'
from public.vacantes v
cross join public.usuarios u
where v.titulo = 'Asistente de atencion al cliente'
  and u.email = 'lucia@demo.com'
on conflict (vacante_id, postulante_id) do nothing;

insert into public.guardados (vacante_id, postulante_id)
select v.id, u.id
from public.vacantes v
cross join public.usuarios u
where v.titulo = 'Mozo junior'
  and u.email = 'lucia@demo.com'
on conflict (vacante_id, postulante_id) do nothing;
