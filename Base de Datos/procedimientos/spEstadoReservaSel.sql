-- spEstadoReservaSel
create procedure spEstadoReservaSel
  
as
	declare @intError int
	begin transaction

	select * from EstadoReserva
		

    set @intError = @@Error
    if (@intError <> 0) goto onError

	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go