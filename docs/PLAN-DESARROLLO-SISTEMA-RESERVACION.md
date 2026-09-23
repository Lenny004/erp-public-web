# Plan maestro para `erp-public-web`

## 1. Estado actual

`erp-public-web` es actualmente un sitio de reservas básico:

- Catálogo de habitaciones.
- Consulta de disponibilidad por fechas y huéspedes.
- Creación de reservas en estado `PENDIENTE`.
- Formulario de contacto.
- Páginas legales.
- Branding configurable por variables de entorno.
- Sin autenticación de huéspedes.
- Sin pagos.
- Sin consulta, modificación o cancelación de reservas.
- Sin confirmación automática al huésped.
- Sin tarifas dinámicas, promociones ni extras.
- Consume únicamente:

```txt
GET  /api/public/rooms
POST /api/public/reservations/availability
POST /api/public/reservations
POST /api/public/contact
```

El frontend no puede convertirse por sí solo en un sistema completo: será necesario ampliar también `erp-core-api`, especialmente sus endpoints públicos, modelo de datos, notificaciones y reglas de negocio.

Nota: el repositorio está en `develop` y tiene remoto `https://github.com/Lenny004/erp-public-web.git`. Antes de comenzar conviene revisar cualquier modificación local pendiente para evitar perder trabajo.

## 2. Objetivo del sistema

Convertir el sitio en un sistema privado de reservación empresarial para un hotel, con:

- Reservas directas en línea.
- Gestión segura de huéspedes.
- Consulta y administración de reservas.
- Confirmaciones y notificaciones automáticas.
- Pagos o solicitudes de pago. (Olvidalo se paga en el lugar no se efectuará)
- Tarifas, temporadas y promociones.
- Reservas corporativas.
- Servicios adicionales.
- Cancelaciones y modificaciones.
- Check-in digital.
- Integración completa con el ERP administrativo.
- Control antifraude, auditoría y cumplimiento legal.

El sistema debe mantener separadas tres áreas:

```txt
Sitio público comercial
        ↓
Portal privado del huésped
        ↓
erp-core-api
        ↓
erp-admin-web / operación hotelera
```

## 3. Módulos existentes que deben consolidarse

### 3.1 Inicio y presentación comercial

Mejoras necesarias:

- Hero configurable.
- Galería del hotel.
- Servicios y amenidades.
- Ubicación y mapa.
- Preguntas frecuentes.
- Políticas principales.
- Llamadas a la acción para reservar.
- SEO completo.
- Open Graph y tarjetas sociales.
- Schema.org para hotel, habitaciones y ofertas.
- Sitemap y robots configurables.
- Gestión de cookies y consentimiento.

### 3.2 Catálogo de habitaciones

Actualmente muestra las habitaciones disponibles, pero necesita:

- Página individual por habitación.
- Galería completa.
- Descripción detallada.
- Capacidad máxima.
- Camas.
- Amenidades.
- Políticas de la habitación.
- Precio desde.
- Tarifas por temporada.
- Disponibilidad real.
- Habitaciones relacionadas.
- Filtros por capacidad, precio, tipo, amenidades y accesibilidad.
- Ordenamiento por precio, capacidad y recomendación.
- Estado de mantenimiento o fuera de inventario.
- URLs amigables por slug.

Rutas propuestas:

```txt
/habitaciones
/habitaciones/[slug]
/habitaciones/[slug]/reservar
```

### 3.3 Buscador de disponibilidad

Debe evolucionar de una consulta simple a un motor de reserva:

- Check-in y check-out.
- Número de huéspedes adultos.
- Niños y edades.
- Número de habitaciones.
- Selección de múltiples habitaciones.
- Reglas de capacidad.
- Disponibilidad por tipo de habitación.
- Reglas de estancia mínima.
- Fechas bloqueadas.
- Tarifas disponibles.
- Impuestos y cargos.
- Extras.
- Moneda.
- Recalculo de precio en tiempo real.
- Protección contra doble reserva.
- Expiración temporal de la cotización.

### 3.4 Wizard de reserva

El flujo actual tiene tres pasos. Debería ampliarse a:

1. Fechas y huéspedes.
2. Selección de habitación.
3. Selección de tarifa.
4. Servicios adicionales.
5. Datos del huésped.
6. Datos de acompañantes.
7. Políticas y consentimiento.
9. Confirmación.

Debe incluir:

- Resumen persistente.
- Precio por noche.
- Número de noches.
- Impuestos.
- Descuentos.
- Extras.
- Total final.
- Validación del lado servidor.
- Recuperación ante errores.
- Reintento seguro.
- Prevención de reservas duplicadas.
- Identificador de cotización.
- Tiempo restante de la cotización.

## 4. Módulos faltantes prioritarios

### 4.1 Portal privado del huésped

Aunque actualmente no existe login, un sistema privado requiere una zona de huésped.

Funciones:

- Registro mediante correo electrónico.
- Inicio de sesión.
- Acceso mediante código temporal enviado por correo.
- Recuperación de acceso.
- Ver reservas actuales y anteriores.
- Consultar detalles de una reserva.
- Descargar confirmación.
- Modificar fechas si la política lo permite.
- Solicitar cambio de habitación.
- Cancelar reserva.
- Ver cargos y pagos.
- Completar datos personales.
- Agregar acompañantes.
- Subir documentos si es necesario.
- Solicitar servicios.
- Revisar mensajes del hotel.

Rutas:

```txt
/mi-reserva
/mi-reserva/acceso
/mi-reserva/[id]
/mi-reserva/[id]/modificar
/mi-reserva/[id]/cancelar
/mi-reserva/[id]/servicios
/perfil
```

Seguridad recomendada:

- Autenticación por enlace o código temporal.
- No exponer reservas solo con un UUID.
- Tokens de acceso de corta duración.
- Limitación de intentos.
- Revocación de sesiones.
- Registro de actividad.
- Protección contra enumeración de reservas.

### 4.2 Consulta de reserva sin cuenta

Para usuarios que no quieran registrarse:

- Código de reserva.
- Correo o teléfono asociado.
- Código OTP.
- Consulta de estado.
- Descarga de confirmación.
- Solicitud de cancelación o cambio.

Endpoints sugeridos:

```txt
POST /api/public/reservations/access
POST /api/public/reservations/verify
GET  /api/public/reservations/:id
POST /api/public/reservations/:id/cancel
POST /api/public/reservations/:id/change-request
```

### 4.3 Estados y ciclo de vida de la reserva

La reserva debe manejar estados revisar la base de datos actual.

Debe existir una máquina de estados con:

- Transiciones válidas.
- Usuario o proceso que ejecutó el cambio.
- Fecha y hora.
- Motivo.
- Comentario.
- Registro de auditoría.
- Notificaciones asociadas.

### 4.4 Motor de tarifas

El precio fijo actual de `RoomType.basePrice` no es suficiente.

Debe soportar:

- Tarifa base.
- Tarifas por temporada.
- Fin de semana.
- Días festivos.
- Alta y baja demanda.
- Estancia mínima.
- Tarifas no reembolsables.
- Tarifas flexibles.
- Descuentos corporativos.
- Descuentos por anticipación.
- Descuentos por larga estancia.
- Precios por ocupación.
- Tarifas por canal.
- Código promocional.
- Restricciones de llegada y salida.

Modelo conceptual:

```txt
RoomType
RatePlan
Season
RateRule
Promotion
Coupon
Restriction
```

La interfaz debe mostrar claramente precio por noche, total de alojamiento, impuestos, cargos adicionales y condiciones de reembolso.

### 4.5 Pagos y garantías

Actualmente `total` se crea en cero y no existe pago.

Debe definirse primero el alcance financiero:

#### Opción A: solicitud de reserva

- El huésped solicita.
- El hotel confirma manualmente.
- Se envía instrucción de pago.
- El estado queda `PAGO_PENDIENTE`.

### 4.6 Notificaciones

El sistema debe enviar notificaciones por evento.

Eventos mínimos:

- Reserva confirmada.
- Reserva rechazada.
- Reserva modificada.
- Reserva cancelada.
- Recordatorio previo al check-in.
- Instrucciones de llegada.
- Recordatorio de check-out.
- Solicitud de contacto.
- Solicitud de servicio.

Canales:

- Correo electrónico.
- WhatsApp.
- SMS, opcional.
- Notificaciones internas para empleados. )

Requisitos:

- Plantillas por organización.
- Variables dinámicas.
- Cola de envío.
- Reintentos.
- Historial de entregas.
- Estado enviado, fallido o pendiente.
- Enlaces seguros.
- Preferencias del huésped.

La integración existente con n8n para `publishReservationCreated` debe evolucionar hacia un sistema de eventos documentado y confiable.

### 4.7 Cancelaciones y modificaciones

Debe existir una política configurable por tarifa:

- Cancelación gratuita
- Penalización por noches.
- No reembolsable.
- No-show.
- Cambio de fechas con diferencia de tarifa.
- Cambio de habitación.
- Restricción de cambios cercanos al check-in.

El frontend debe mostrar qué puede cambiar el huésped, hasta cuándo puede hacerlo, cuánto cuesta(LUEGO SE LE COBRA EN PERSONA) y qué importe se reembolsa.

### 4.8 Servicios adicionales

El esquema ya contempla pedidos vinculados a reservas, pero el portal no los expone.

Servicios recomendados:

- Desayuno.
- Transporte.
- Cama adicional.
- Cuna.
- Early check-in.
- Late check-out.
- Lavandería.
- Room service.
- Decoración.
- Tours.
- Salas o eventos.
- Solicitudes especiales.

Funciones:

- Catálogo de servicios.
- Precio.
- Disponibilidad.
- Restricciones.
- Solicitud durante la reserva.
- Solicitud durante la estadía.
- Aprobación interna.
- Estado de cumplimiento.
- Cargo a la reserva.

Rutas:

```txt
/servicios
/mi-reserva/[id]/servicios
```

### 4.9 Check-in digital

Para una operación privada más completa:

- Pre-registro.
- Datos del huésped.
- Acompañantes.
- Documento de identidad.
- Firma o aceptación de términos.
- Hora estimada de llegada.
- Solicitud de transporte.
- Instrucciones de acceso.
- Estado de documentación pendiente.

Debe implementarse con especial cuidado legal y de privacidad.

### 4.10 Contacto y atención al cliente

El formulario actual devuelve un acuse genérico, pero no existe una bandeja visible ni trazabilidad.

Debe agregarse:

- Número de ticket.
- Categoría de consulta.
- Prioridad.
- Estado.
- Historial de mensajes.
- Respuesta desde el panel administrativo.
- Correo de confirmación.
- Integración con WhatsApp.
- Protección anti-spam.
- SLA interno.

Categorías:

- Reserva.
- Pago.
- Cancelación.
- Facturación.
- Eventos.
- Servicios.
- Queja o reclamo.
- Información general.

## 5. Módulos específicos para empresa

### 5.1 Programa corporativo

Para clientes empresariales:

- Perfil de empresa.
- Contactos autorizados.
- Empleados o viajeros.
- Tarifa corporativa.
- Código corporativo.
- Límite de crédito.
- Facturación consolidada.
- Centro de costos.
- Aprobación de viajes.
- Reportes por empresa.
- Historial de consumo.

Rutas posibles:

```txt
/corporativo
/corporativo/acceso
/corporativo/reservas
/corporativo/empleados
/corporativo/reportes
```


### 5.2 Eventos y grupos

Para conferencias, bodas o grupos:

- Solicitud de cotización.
- Bloqueo de habitaciones.
- Número estimado de huéspedes.
- Fecha límite de confirmación.
- Habitaciones reservadas por bloque.
- Lista de huéspedes.
- Servicios contratados.
- Depósitos.
- Contrato.
- Estado de la propuesta.

## 6. Contratos que deben ampliarse en `erp-core-api`

### Catálogo

```txt
GET /api/public/rooms
GET /api/public/rooms/:slug
GET /api/public/amenities
GET /api/public/services
GET /api/public/policies
```

### Disponibilidad

```txt
POST /api/public/search
POST /api/public/quotes
GET  /api/public/quotes/:id
```

La disponibilidad debe validarse nuevamente en el servidor al confirmar la reserva.

### Reservas

```txt
POST /api/public/reservations
GET  /api/public/reservations/:id
POST /api/public/reservations/access
POST /api/public/reservations/verify
PATCH /api/public/reservations/:id
POST /api/public/reservations/:id/cancel
POST /api/public/reservations/:id/change-request
```

### Pagos

```txt
POST /api/public/payments/intents
POST /api/public/payments/confirm
POST /api/public/payments/webhook
GET  /api/public/reservations/:id/payments
```

### Huéspedes

```txt
POST /api/public/guests
GET  /api/public/guests/me
PATCH /api/public/guests/me
```

### Servicios

```txt
GET  /api/public/services
POST /api/public/reservations/:id/services
PATCH /api/public/reservations/:id/services/:serviceId
DELETE /api/public/reservations/:id/services/:serviceId
```

### Notificaciones

```txt
GET /api/public/reservations/:id/notifications
POST /api/public/reservations/:id/resend-confirmation
```

## 7. Cambios al modelo de datos

El modelo actual necesita al menos estas entidades adicionales:

```txt
Guest
GuestAccessToken
GuestSession
GuestCompanion
ReservationItem
ReservationRate
RatePlan
Season
Promotion
Coupon
Quote
Payment
Refund
CancellationPolicy
ReservationStatusHistory
Notification
NotificationTemplate
NotificationDelivery
GuestRequest
HotelService
CorporateAccount
CorporateTraveler
CorporateRate
CorporateBookingApproval
ContactTicket
ConsentRecord
AuditLog
```

También conviene modificar `Reservation` para incluir:

- Código público de reserva.
- Correo del huésped.
- Número de huéspedes.
- Precio base.
- Impuestos.
- Descuentos.
- Total final.
- Moneda.
- Política aplicada.
- Código promocional.
- Fecha de expiración de cotización.
- Fecha de confirmación.
- Fecha de cancelación.
- Motivo de cancelación.
- Canal de origen.
- Identificador de correlación.

La reserva pública actual usa `guestDoc: ""`; debe sustituirse por un campo opcional hasta que el proceso de check-in lo requiera.

## 8. Seguridad y privacidad

Este módulo es obligatorio antes de producción.

### Protección de endpoints

- Rate limiting por IP.
- Rate limiting por correo.
- CAPTCHA o Turnstile en formularios sensibles.
- Validación Zod en backend.
- Idempotency keys para crear reservas y pagos.
- Protección contra enumeración.
- Headers de seguridad.
- CSRF donde aplique.
- Sanitización de entradas.
- Logs sin datos sensibles.

### Protección de datos

- Política de retención.
- Consentimiento explícito.
- Exportación de datos personales.
- Solicitud de eliminación.
- Enmascaramiento de correo y teléfono.
- Cifrado de documentos.
- Control de acceso por organización.
- Auditoría de accesos.
- No guardar datos completos de tarjeta.

### Privacidad legal

- Términos de reserva.
- Política de cancelación.
- Política de privacidad.
- Política de cookies.
- Aviso de tratamiento de datos.
- Consentimiento para comunicaciones.
- Términos de servicios adicionales.

## 9. Experiencia de usuario

Cada flujo debe contemplar estados de carga, sin resultados, error de red, error de validación, habitación ocupada durante el proceso, cotización expirada, pago rechazado, sesión expirada, reserva duplicada y servicio no disponible.

### Accesibilidad

- Navegación completa por teclado.
- Labels correctos.
- Foco visible.
- Lectores de pantalla.
- Contraste AA.
- Mensajes de error asociados a campos.
- Respeto a `prefers-reduced-motion`.
- Formularios accesibles en móvil.

### Internacionalización

Aunque la primera versión puede ser en español:

- Separar textos de traducción.
- Soportar español e inglés.
- Formato regional de fechas.
- Moneda configurable.
- Zona horaria de la propiedad.

## 10. Analítica y operación

Debe medirse:

- Visitas.
- Búsquedas.
- Habitaciones vistas.
- Búsquedas sin disponibilidad.
- Inicio de reserva.
- Abandono por paso.
- Reservas creadas.
- Reservas confirmadas.
- Cancelaciones.
- Conversión.
- Uso de cupones.
- Ingresos por canal.
- Errores de pago.
- Contactos recibidos.

También se necesitan:

- Error tracking.
- Logs estructurados.
- Health checks.
- Métricas de API.
- Alertas de fallos.
- Monitoreo de disponibilidad.
- Auditoría de reservas.
- Registro de eventos de negocio.

## 11. Fases recomendadas

### Fase 0: descubrimiento y contratos

Objetivo: definir reglas antes de programar.

Entregables:

- Inventario de reglas hoteleras.
- Políticas de cancelación.
- Esquema de tarifas.
- Reglas de impuestos.
- Definición de estados.
- Flujo de aprobación.
- Decisión sobre cuentas de huéspedes.
- Contratos frontend/backend.
- Criterios de aceptación.
- Revisión de la modificación local pendiente.

### Fase 1: fortalecer el motor de reserva

Prioridad máxima:

- Disponibilidad robusta.
- Reglas de capacidad.
- Validación de solapamientos.
- Cotizaciones.
- Cálculo de noches.
- Tarifas.
- Impuestos.
- Total real.
- Expiración de cotización.
- Prevención de doble reserva.
- Código de reserva.

### Fase 2: experiencia de reserva comercial

- Habitaciones detalladas.
- Filtros.
- Tarifas.
- Promociones.
- Extras.
- Wizard ampliado.
- Resumen de precio.
- Confirmación mejorada.
- SEO.
- Analítica de conversión.

### Fase 3: portal privado del huésped

- Acceso por correo y OTP.
- Consulta de reserva.
- Modificaciones.
- Cancelaciones.
- Descarga de confirmación.
- Perfil.
- Acompañantes.
- Preferencias de comunicación.

### Fase 4: notificaciones

- Confirmaciones por correo.
- Recordatorios.
- Cambios de estado.
- Cancelaciones.
- Plantillas.
- Reintentos.
- Registro de entregas.
- WhatsApp mediante n8n si corresponde.

### Fase 5: pagos
- Recibos QUE LE PUEDE LLEGAR AL CORREO O FACTURA CUANDO PAGUE EL DÍA QUE LLEGUE.

### Fase 6: servicios y experiencia durante la estadía

- Catálogo de servicios.
- Solicitudes a habitación.
- Transporte.
- Early check-in.
- Late check-out.
- Room service.
- Solicitudes especiales.
- Estado de cumplimiento.

### Fase 7: clientes corporativos y grupos

- Empresas.
- Tarifas corporativas.
- Viajeros.
- Aprobaciones.
- Centros de costo.
- Facturación consolidada.
- Bloques de habitaciones.
- Eventos y grupos.

### Fase 8: check-in digital y cumplimiento

- Pre-registro.
- Documentos.
- Acompañantes.
- Consentimientos.
- Firma.
- Auditoría.
- Retención y eliminación de datos.

### Fase 9: endurecimiento de producción

- Pruebas de carga.
- Pruebas de seguridad.
- Pruebas de pagos.
- Pruebas de doble reserva.
- Accesibilidad.
- SEO.
- Monitoreo.
- Backups.
- Recuperación ante desastres.
- Manuales operativos.

## 12. Prioridad funcional

### Imprescindible para una primera versión empresarial

- Motor de disponibilidad confiable.
- Cálculo real de precios.
- Cotización temporal.
- Confirmación de reserva.
- Consulta de reserva.
- Cancelación y modificación.
- Notificaciones.
- Políticas configurables.
- Seguridad y anti-spam.
- Auditoría.
- Integración con el panel administrativo.

### Segunda prioridad

- Promociones.
- Servicios adicionales.
- Portal del huésped.
- Check-in digital.
- Analítica.
- Multiidioma.

### Tercera prioridad

- Cuentas corporativas.
- Tarifas corporativas.
- Grupos y eventos.
- Programa de fidelidad(ACTIVAR O NO DESDE EL ADMIN WEB)
- Integración con WhatsApp.
- Automatizaciones avanzadas.
- Recomendaciones personalizadas.

## 13. Criterios de aceptación globales

El sistema estará listo para producción cuando:

- No permita doble reserva en una misma habitación.
- El precio mostrado sea igual al precio registrado.
- Toda reserva tenga código consultable.
- El huésped pueda recibir y recuperar su confirmación.
- Las cancelaciones respeten la política aplicada.
- Los errores no creen reservas duplicadas.
- Los endpoints públicos tengan rate limit y validación.
- No se expongan datos de otros huéspedes.
- Cada transición importante quede auditada.
- El administrador pueda ver y gestionar todas las reservas.
- El huésped pueda completar el flujo desde móvil.
- El sistema tenga monitoreo y recuperación operativa.
- Las políticas legales estén visibles antes de confirmar.

## Recomendación final

El siguiente paso debería ser crear una especificación de producto compartida entre `erp-public-web` y `erp-core-api`, empezando por:

1. Estados de reserva.
2. Motor de tarifas.
3. Cotización.
4. Política de cancelación.
5. Acceso privado del huésped.
6. Notificaciones.

Sin definir esos puntos, ampliar solamente la interfaz produciría un frontend más completo visualmente, pero seguiría dependiendo de un backend incapaz de garantizar reservas, precios y estados consistentes.
