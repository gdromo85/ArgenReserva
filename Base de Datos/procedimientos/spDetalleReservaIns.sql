-- spDetalleReservaIns
create procedure spDetalleReservaIns
	@ReservaID              int,
	@UnidadAlojamientoID    int,
	@PrecioACobrar          decimal(18,2),
	@CantidadPersonas       int,
	@FechaDesde             datetime,
	@FechaHasta             datetime
as
	declare @intError int
	begin transaction

	insert DetalleReserva (ReservaID, UnidadAlojamientoID, PrecioACobrar, CantidadPersonas, FechaDesde, FechaHasta)
	values (@ReservaID, @UnidadAlojamientoID, @PrecioACobrar, @CantidadPersonas, @FechaDesde, @FechaHasta)

      set @intError = @@Error
      if (@intError <> 0) goto onError

    SELECT SCOPE_IDENTITY() AS DetalleReservaID

	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go