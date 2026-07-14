-- spDetalleReservaDel
create procedure spDetalleReservaDel
  @DetalleReservaID int
as
	declare @intError int
	begin transaction

	delete DetalleReserva where DetalleReservaID = @DetalleReservaID

    set @intError = @@Error
    if (@intError <> 0) goto onError

	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go