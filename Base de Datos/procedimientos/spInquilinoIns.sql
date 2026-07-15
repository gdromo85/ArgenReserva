-- spInquilinoIns
alter procedure spInquilinoIns
	@nombre        varchar(200),
	@Apellido      varchar(200),
	@direccion     varchar(500)= null, 
	@telefono      varchar(160),
	@descripcion   varchar(500)= null
as
	declare @intError int
	begin transaction

	insert Inquilino (nombre, Apellido, direccion, telefono, descripcion)
	values (@nombre, @Apellido, @direccion, @telefono, @descripcion)

      set @intError = @@Error
      if (@intError <> 0) goto onError

    SELECT SCOPE_IDENTITY() AS InquilinoID

	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go