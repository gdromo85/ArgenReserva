create procedure spUnidadAlojamientoUpd
    @UnidadAlojamientoId	int,
	@Nombre			 varchar(500),
	@ComplejoId      Int,
	@Capacidad      Int,
	@Descripcion	 varchar(MAX),
	@Precio     Decimal

as
	declare @intError int
	begin transaction
	
	update UnidadAlojamiento 
		set Nombre = @Nombre,
			Descripcion=@Descripcion,
			Capacidad=@Capacidad,
			Precio=@Precio	
		where 	
			UnidadAlojamientoId = @UnidadAlojamientoId


      set @intError = @@Error
      if (@intError <> 0) goto onError
      select @@Identity
  
	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go
