-- spComplejoXUsuarioSel    1
create procedure spComplejoXUsuarioSel
  @UsuarioID int = null
  
as
	declare @intError int
	begin transaction
	
	
	Select 
	 c.ComplejoID,
	 c.Nombre, 
	 c.Direccion, 
	 c.Telefono, 
	 c.Descripcion 
	from UsuarioComplejos as uc
	inner join Complejos c on c.ComplejoId = uc.ComplejoId
    where UsuarioID  = isnull(@UsuarioID,UsuarioID)
			
		 
    set @intError = @@Error
    if (@intError <> 0) goto onError
  
	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go