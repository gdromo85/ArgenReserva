alter procedure spUnidadAlojamientoIns
	@Nombre			 varchar(500),
	@ComplejoId      Int,
	@Capacidad      Int,
	@Descripcion	 varchar(MAX),
	@Precio     Decimal

as
	declare @intError int
	begin transaction
	
	insert UnidadAlojamiento(Nombre,ComplejoId,Capacidad, Descripcion,Precio)
    values (@Nombre, @ComplejoId, @Capacidad, @Descripcion,@Precio)
      
      set @intError = @@Error
      if (@intError <> 0) goto onError
      select @@Identity
  
   -- DEVUELVE EL ID INSERTADO
    SELECT SCOPE_IDENTITY() AS ComplejoId

	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go
