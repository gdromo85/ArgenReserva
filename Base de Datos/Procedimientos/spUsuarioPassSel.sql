
--spUsuarioPassSel 'Juan','123', 7
alter procedure spUsuarioPassSel
  @Nombre			varchar (128) = null,
  @PasswordHash				varchar (128) = null,
  @Sistema					int = null
as
    declare @intError int
    declare @intUsuario int
    declare @PersonaId int
    declare @TipoSistema int
    declare @Version int
	declare @VersionActual int
	declare  @Error varchar(200) 

   


    
    /*parche por si entran con un vacio o con un numero de documento que este mal*/
    if   len(@Nombre) < 3  begin
		RAISERROR ('Usuario incorrecto', 16,1)
		
		set @intError = @@Error
        if (@intError <> 0) goto onError
	end
    
    /*Olvido ingresar la contraseña*/
	if  ( ltrim(@PasswordHash) = '') begin
		RAISERROR ('Olvido ingresar una contraseña', 16,1)
		
		set @intError = @@Error
        if (@intError <> 0) goto onError
	end


		if not exists (select 1 
					from Usuarios u (nolock)
					where u.Nombre  = @Nombre
					 and  u.PasswordHash = @PasswordHash )
					  begin
			RAISERROR ('La contraseña ingresada no es valida, vuelva a intentar', 16,1)
			
			set @intError = @@Error
			if (@intError <> 0) goto onError
		end
	
	
	

 Select u.*
	from Usuarios u (nolock)

	  where u.Nombre = @Nombre and PasswordHash = @PasswordHash

	set @intError = @@Error
	if (@intError <> 0) goto onError
	
	
		
	
	
return @intError
onError:

  return @intError
go

