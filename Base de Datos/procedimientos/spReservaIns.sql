-- spReservaIns
create procedure spReservaIns
	@InquilinoID    int,
	@TipoReservaID  int,
	@Sena           decimal(18,2),
	@TotalAPagar    decimal(18,2),
	@TotalPagado    decimal(18,2)
as
	declare @intError int
	begin transaction

	insert Reserva (InquilinoID, TipoReservaID, Sena, TotalAPagar, TotalPagado)
	values (@InquilinoID, @TipoReservaID, @Sena, @TotalAPagar, @TotalPagado)

      set @intError = @@Error
      if (@intError <> 0) goto onError

    SELECT SCOPE_IDENTITY() AS ReservaID

	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go