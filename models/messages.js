module.exports = function( req ) { 
    this.req = req;
    this.getMessage = function( clean ){
        if ( this.req.session.successMessage ) return this.getSuccessMessage( clean || true );
        else if ( this.req.session.errorMessage ) return this.getErrorMessage( clean || true );
        else if ( this.req.session.warningMessage ) return this.getWarningMessage( clean || true );
        else return '';
    };
        
    this.getSuccessMessage = function( clean ){
        var result = '<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert">×</button>' + this.req.session.successMessage + '</div>';
        if ( clean!==false ) this.req.session.successMessage = null;
        return result;
    };
        
    this.getErrorMessage = function( clean ){
        var result = '<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>' + this.req.session.errorMessage + '</div>';
        if ( clean!==false ) this.req.session.errorMessage = null;
        return result;
    };
        
    this.getWarningMessage = function( clean ){
        var result = '<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">×</button>' + this.req.session.warningMessage + '</div>';
        if ( clean!==false ) this.req.session.warningMessage = null;
        return result;
    };
    
}
