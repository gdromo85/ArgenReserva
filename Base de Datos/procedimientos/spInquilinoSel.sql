-- spComplejoSel
create procedure spInquilinoSel
  @InquilinoId int = null
  
as
	declare @intError int
	begin transaction
	
	
	Select * from Inquilino 
		where InquilinoId  = isnull(@InquilinoId,InquilinoId)
			
			order by Nombre
		 
    set @intError = @@Error
    if (@intError <> 0) goto onError
  
	commit transaction
	return @intError

onError:
  if @@TranCount > 0 rollback transaction
  return @intError
go