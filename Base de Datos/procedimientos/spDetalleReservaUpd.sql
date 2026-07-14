-- spDetalleReservaUpd
create procedure spDetalleReservaUpd
	@DetalleReservaID       int,
	@UnidadAlojamientoID    int,
	@PrecioACobrar          decimal(18,2),
	@CantidadPersonas       int,
	@FechaDesde             datetime,
	@FechaHasta             datetime
as
	declare @intError int
	begin transaction

	update DetalleReserva
		set UnidadAlojamientoID = @UnidadAlojamientoID,
			PrecioACobrar = @PrecioACobrar,
			CantidadPersonas = @CantidadPersonas,
			FechaDesde = @FechaDesde,
			FechaHasta = @FechaHasta
		where DetalleReservaID = @DetalleReservaID

      set @intError = @@Error
      if (@intError <> 0) goto onError

	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go