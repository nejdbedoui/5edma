export class FournisseurDto{
    nom:string;
    societe:string;
    email:string;
    tel:string;
    falerter:boolean;
    fdefault:boolean;
    id:string
    isnew:boolean
    constructor(){
        this.falerter=false;
        this.fdefault=false;
    }
}