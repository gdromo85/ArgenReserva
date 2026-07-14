-- spInquilinoDel
create procedure spInquilinoDel
  @InquilinoID int
as
	declare @intError int
	begin transaction

	delete Inquilino
		where InquilinoID = @InquilinoID

    set @intError = @@Error
    if (@intError <> 0) goto onError

	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go