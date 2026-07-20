-- spReservaUpd
ALTER procedure spReservaUpd
	@ReservaID      int,
	@InquilinoID    int,
	@TipoReservaID  int,
	@Sena           decimal(18,2),
	@TotalAPagar    decimal(18,2),
	@TotalPagado    decimal(18,2),
	@EstadoReservaID int,
	@Descripcion  nvarchar(max) = null
as
	declare @intError int
	begin transaction

	update Reserva
		set InquilinoID = @InquilinoID,
			TipoReservaID = @TipoReservaID,
			Sena = @Sena,
			TotalAPagar = @TotalAPagar,
			TotalPagado = @TotalPagado,
			EstadoReservaID = @EstadoReservaID,
			Descripcion = @Descripcion
		where ReservaID = @ReservaID

      set @intError = @@Error
      if (@intError <> 0) goto onError

	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go