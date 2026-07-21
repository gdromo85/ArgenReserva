-- spComplejoDel
alter procedure spComplejoDel
    @ComplejoId int,
    @UsuarioId  int
as
    declare @intError int
    declare @otrosUsuarios int

    begin transaction

    delete UsuarioComplejos where ComplejoId = @ComplejoId and UsuarioId = @UsuarioId
    set @intError = @@Error
    if (@intError <> 0) goto onError

    select @otrosUsuarios = count(*) from UsuarioComplejos where ComplejoId = @ComplejoId

    if (@otrosUsuarios = 0)
    begin
        delete Complejos where ComplejoID = @ComplejoId
        set @intError = @@Error
        if (@intError <> 0) goto onError
    end

    commit transaction
    return @intError
onError:
    if @@TranCount > 0 rollback transaction
    return @intError
go