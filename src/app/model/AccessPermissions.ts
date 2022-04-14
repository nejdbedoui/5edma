export class AccessPermissionsPv {
    pointVente: String;
    permissions: Permissions[];

    constructor( pointVente: String, permissions: Permissions[]){
        this.pointVente = pointVente;
        this.permissions = permissions;
    }

}

export class AccessPermissions {
    accessPermissionsPv: AccessPermissionsPv[];
    settingsPermissions: Permissions[];
    adminPermission: boolean;
}

export class Permissions{
    functionName: String;
    access: number;
    checked: boolean;

    constructor( functionName: String, access: number, checked: boolean){
        this.functionName = functionName;
        this.access = access;
        this.checked = checked;
    }
}