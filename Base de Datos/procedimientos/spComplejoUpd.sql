create procedure spComplejoUpd
    @ComplejoID			 int,
	@Nombre			 varchar(500),
	@Descripcion	 varchar(500),
	@Telefono	     varchar(500),
	@Direccion	     varchar(500)

as
	declare @intError int
	begin transaction
	
	update Complejos 
		set Nombre = @Nombre,
			Descripcion=@Descripcion,
			Telefono=@Telefono,
			Direccion=@Direccion		
		where 	
			ComplejoID = @ComplejoID


      set @intError = @@Error
      if (@intError <> 0) goto onError
      select @@Identity
  
	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go
