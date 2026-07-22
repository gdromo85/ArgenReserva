-- spReservaSel null, 2
ALTER procedure spReservaSel
   @ReservaID int = null,
   @UsuarioID int = null
as
	declare @intError int
	begin transaction

	select 
		r.ReservaID,
		r.Sena,
		r.TotalAPagar,
		r.TotalPagado,
		r.FechaRegistro,
		r.Descripcion,

		i.InquilinoID,
		i.nombre        as Inquilino_Nombre,
		i.Apellido      as Inquilino_Apellido,
		i.direccion     as Inquilino_Direccion,
		i.telefono      as Inquilino_Telefono,
		i.descripcion   as Inquilino_Descripcion,

		tr.TipoReservaID,
		tr.nombre       as TipoReserva_Nombre,
		tr.descripcion  as TipoReserva_Descripcion,

		er.EstadoReservaId,
		er.nombre       as EstadoReserva_Nombre,
		er.descripcion  as EstadoReserva_Descripcion

	from Reserva r
		inner join Inquilino i on i.InquilinoID = r.InquilinoID
		inner join TipoReserva tr on tr.TipoReservaID = r.TipoReservaID
		inner join EstadoReserva er on er.EstadoReservaId = r.EstadoReservaID

		inner join detalleReserva dr on dr.ReservaID = r.ReservaID
		inner join UnidadAlojamiento a on a.UnidadAlojamientoId = dr.UnidadAlojamientoID
		inner join UsuarioComplejos c on c.ComplejoID = a.ComplejoId
	where r.ReservaID = isnull(@ReservaID, r.ReservaID) and c.UsuarioID  = isnull(@UsuarioID,c.UsuarioID)
	order by r.ReservaID desc

    set @intError = @@Error
    if (@intError <> 0) goto onError

	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go