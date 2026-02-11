-- spUsuarioSel
alter procedure spUsuarioSel
  @UsuarioID int = null
  
as
	declare @intError int
	
	
	
	Select * from Usuarios 
		where UsuarioID  = isnull(@UsuarioID,UsuarioID)
			
			order by Nombre
		 
    set @intError = @@Error
    if (@intError <> 0) goto onError

	return @intError

onError:

  return @intError
go

