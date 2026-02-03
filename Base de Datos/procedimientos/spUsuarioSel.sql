-- spComplejoSel
create procedure spUsuarioSel
  @UsuarioID int = null
  
as
	declare @intError int
	begin transaction
	
	
	Select * from Usuarios 
		where UsuarioID  = isnull(@UsuarioID,UsuarioID)
			
			order by Nombre
		 
    set @intError = @@Error
    if (@intError <> 0) goto onError
  
	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go