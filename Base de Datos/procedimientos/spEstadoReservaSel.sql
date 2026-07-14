-- spDetalleReservaSel
create procedure spDetalleReservaSel
  @ReservaID int = null,
  @DetalleReservaID int = null
as
	declare @intError int
	begin transaction

	select * from DetalleReserva
		where ReservaID = isnull(@ReservaID, ReservaID)
		  and DetalleReservaID = isnull(@DetalleReservaID, DetalleReservaID)

    set @intError = @@Error
    if (@intError <> 0) goto onError

	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go