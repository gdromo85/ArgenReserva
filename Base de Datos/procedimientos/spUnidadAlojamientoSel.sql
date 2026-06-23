-- spUnidadAlojamientoSel 2
alter procedure spUnidadAlojamientoSel
  @UnidadAlojamientoId int = null,
  @ComplejoId int = null
  
as
	declare @intError int
	begin transaction
	
	
	Select * from UnidadAlojamiento 
		where ComplejoId  = isnull(@ComplejoId,ComplejoId)
		AND UnidadAlojamientoId = ISNULL(@UnidadAlojamientoId, UnidadAlojamientoId)
			
			order by Nombre
		 
    set @intError = @@Error
    if (@intError <> 0) goto onError
  
	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go