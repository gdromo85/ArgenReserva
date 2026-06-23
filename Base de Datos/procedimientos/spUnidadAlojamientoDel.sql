-- spComplejoDel
create procedure spUnidadAlojamientoDel
  @UnidadAlojamientoId int 
  
as
	declare @intError int
	begin transaction
	
	
	delete UnidadAlojamiento 
		where unidadAlojamientoId  = @UnidadAlojamientoId
		 
    set @intError = @@Error
    if (@intError <> 0) goto onError
  
	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go