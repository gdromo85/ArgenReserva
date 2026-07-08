CREATE TABLE UnidadAlojamientoPorServicio (
   Codigo					int                  identity(1, 1),
   UnidadAlojamientoId				int					 not null,
   ServicioAlojamientoId			int					 not null,
); 