-- spTipoReservaSel
create procedure spTipoReservaSel
  @TipoReservaID int = null
as
	declare @intError int
	begin transaction

	select * from TipoReserva
		where TipoReservaID = isnull(@TipoReservaID, TipoReservaID)
		order by nombre

    set @intError = @@Error
    if (@intError <> 0) goto onError

	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go