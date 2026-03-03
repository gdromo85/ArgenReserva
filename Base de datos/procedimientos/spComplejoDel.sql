-- spComplejoDel
create procedure spComplejoDel
  @ComplejoID int 
  
as
	declare @intError int
	begin transaction
	
	
	delete Complejos 
		where ComplejoID  = @ComplejoID
		 
    set @intError = @@Error
    if (@intError <> 0) goto onError
  
	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go