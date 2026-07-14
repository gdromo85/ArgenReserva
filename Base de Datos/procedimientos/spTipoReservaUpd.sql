-- spTipoReservaUpd
create procedure spTipoReservaUpd
	@TipoReservaID   int,
	@nombre          varchar(200),
	@descripcion     varchar(500)
as
	declare @intError int
	begin transaction

	update TipoReserva
		set nombre = @nombre,
			descripcion = @descripcion
		where TipoReservaID = @TipoReservaID

      set @intError = @@Error
      if (@intError <> 0) goto onError

	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go