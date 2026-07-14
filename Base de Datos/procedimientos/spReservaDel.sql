-- spReservaDel (borra primero los detalles por la FK)
create procedure spReservaDel
  @ReservaID int
as
	declare @intError int
	begin transaction

	delete DetalleReserva where ReservaID = @ReservaID
	delete Reserva where ReservaID = @ReservaID

    set @intError = @@Error
    if (@intError <> 0) goto onError

	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go