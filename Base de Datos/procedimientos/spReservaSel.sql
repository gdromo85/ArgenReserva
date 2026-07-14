-- spReservaSel
create procedure spReservaSel
   @ReservaID int = null
as
	declare @intError int
	begin transaction

	select 
		r.ReservaID,
		r.Sena,
		r.TotalAPagar,
		r.TotalPagado,

		i.InquilinoID,
		i.nombre        as Inquilino_Nombre,
		i.Apellido      as Inquilino_Apellido,
		i.direccion     as Inquilino_Direccion,
		i.telefono      as Inquilino_Telefono,
		i.descripcion   as Inquilino_Descripcion,

		tr.TipoReservaID,
		tr.nombre       as TipoReserva_Nombre,
		tr.descripcion  as TipoReserva_Descripcion

	from Reserva r
		inner join Inquilino i on i.InquilinoID = r.InquilinoID
		inner join TipoReserva tr on tr.TipoReservaID = r.TipoReservaID
	where r.ReservaID = isnull(@ReservaID, r.ReservaID)
	order by r.ReservaID desc

    set @intError = @@Error
    if (@intError <> 0) goto onError

	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go