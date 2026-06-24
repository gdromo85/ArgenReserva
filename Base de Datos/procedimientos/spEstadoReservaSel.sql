-- spEstadoReservaSel
create procedure spEstadoReservaSel
  @EstadoReservaId int = null
  
as
	declare @intError int
	begin transaction
	
	
	Select * from EstadoReserva 
		where EstadoReservaId  = isnull(@EstadoReservaId,EstadoReservaId)
			
			order by Nombre
		 
    set @intError = @@Error
    if (@intError <> 0) goto onError
  
	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go