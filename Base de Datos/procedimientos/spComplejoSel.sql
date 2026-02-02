-- spComplejoSel
create procedure spComplejoSel
  @ComplejoID int = null
  
as
	declare @intError int
	begin transaction
	
	
	Select * from Complejos 
		where ComplejoID  = isnull(@ComplejoID,ComplejoID)
			
			order by Nombre
		 
    set @intError = @@Error
    if (@intError <> 0) goto onError
  
	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go