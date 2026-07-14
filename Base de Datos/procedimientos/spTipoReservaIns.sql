-- spTipoReservaIns
create procedure spTipoReservaIns
	@nombre        varchar(200),
	@descripcion   varchar(500)
as
	declare @intError int
	begin transaction

	insert TipoReserva (nombre, descripcion)
	values (@nombre, @descripcion)

      set @intError = @@Error
      if (@intError <> 0) goto onError

    SELECT SCOPE_IDENTITY() AS TipoReservaID

	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go