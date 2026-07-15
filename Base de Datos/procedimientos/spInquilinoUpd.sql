-- spInquilinoUpd
alter procedure spInquilinoUpd
	@InquilinoID   int,
	@nombre        varchar(200),
	@Apellido      varchar(200),
	@direccion     varchar(500) = null,
	@telefono      varchar(160),
	@descripcion   varchar(500) = null
as
	declare @intError int
	begin transaction

	update Inquilino
		set nombre = @nombre,
			Apellido = @Apellido,
			direccion = @direccion,
			telefono = @telefono,
			descripcion = @descripcion
		where InquilinoID = @InquilinoID

      set @intError = @@Error
      if (@intError <> 0) goto onError

	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go