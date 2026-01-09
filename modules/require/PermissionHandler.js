define([], function () {

    function checkPermission (permission) {
        return applicationManager.getConfigurationManager().checkUserPermission(permission);
    }
    
    function checkAllPermissions (permissionArray) {
       return  permissionArray.every(checkPermission);
    }

    function PermissionHandler (config, formObject) {
        this.config = config;
        this.formObject = formObject;
    };

    PermissionHandler.prototype.executeYesMethod = function (config) {
        if (!config.yes) {
            return;
        }
        if (this.formObject) {
            this.formObject[config.yes].call(this.formObject);
        }
        else {
            config.yes();
        }
    }

    PermissionHandler.prototype.executeNoMethod = function (config) {
        if (!config.no) {
            return;
        }
        if (this.formObject) {
            this.formObject[config.no].call(this.formObject);
        }
        else {
            config.no();
        }
    }

    
    PermissionHandler.prototype.executeSingle = function (permissionConfig) {
        var permission = permissionConfig.permission;
        var isActionAllowed = false;
        if (Array.isArray(permission)) {
            isActionAllowed = checkAllPermissions(permission);
        }
        else if (typeof permission === "function") {
            isActionAllowed = permission.call();
        }
        else {
            isActionAllowed = checkPermission(permission);
        }
        if (isActionAllowed) {
            this.executeYesMethod(permissionConfig);
        }
        else {
            this.executeNoMethod(permissionConfig);
        }
    }

    PermissionHandler.prototype.executeAll = function (permissionsToExecute) {
        permissionsToExecute.forEach(this.executeSingle.bind(this));
    }

    PermissionHandler.prototype.getPermissionsToExecute = function (key) {
        if (key) {
            return this.config.filter(function (permissionConfig) {
                return permissionConfig.key === key;
            })
        }
        else {
            return this.config.filter(function (permissionConfig) {
                return permissionConfig.key === undefined || permissionConfig.key === null;
            })
        }
    }


 
    PermissionHandler.prototype.execute = function (key) {   
        if (Array.isArray(this.config)) {
           this.executeAll(this.getPermissionsToExecute(key));
        } 
    };

    function executeAuthorizationFramework (formObject, key, formauthorizationconfig) {
        const formConfig = formauthorizationconfig[formObject.view.id];
        const permissionHandler = new PermissionHandler(formConfig, formObject);
        permissionHandler.execute(key);
    }

    function OR () {
        var permissions = Array.prototype.slice.call(arguments);
        return function () {
            return permissions.some(checkPermission);
        }
    }

    return {
        PermissionHandler: PermissionHandler,
        executeAuthorizationFramework: executeAuthorizationFramework,
        OR: OR
    }; 
})