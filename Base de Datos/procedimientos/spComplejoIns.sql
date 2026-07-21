alter procedure spComplejoIns
	@Nombre			 varchar(500),
	@Descripcion	 varchar(500),
	@Telefono	     varchar(500),
	@Direccion	     varchar(500),
	@UsuarioId       int
as
	declare @intError int
	declare @ComplejoId int

	begin transaction
	
	insert Complejos (Nombre, Direccion, Telefono, Descripcion)
	values (@Nombre, @Direccion, @Telefono, @Descripcion)

      set @intError = @@Error
      if (@intError <> 0) goto onError

    set @ComplejoId = SCOPE_IDENTITY()

	insert UsuarioComplejos (UsuarioId, ComplejoId, RolEnComplejo)
	values (@UsuarioId, @ComplejoId, 'Gerente')

      set @intError = @@Error
      if (@intError <> 0) goto onError

    -- DEVUELVE EL ID INSERTADO
    SELECT @ComplejoId AS ComplejoId
	commit transaction
	return @intError
onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go