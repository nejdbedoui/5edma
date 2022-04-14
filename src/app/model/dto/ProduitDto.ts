export class ProduitDto{
    idProduit: string;
    idCateg: string;
    idPartenaire: string;
    code: string;
    designation: string;
    description: string;
    composition: string;
    stockReel: number;
    dateCreation: Date;
    ajoutePar: string;
    reference: string;
    prixHt: number;
    prixTtc: number;
    urlImg: string;
    fVendu: number;
    fAchete: number;
    typeProduit: string;
    codeBarre: string;
    referenceInterne: string;
    fRacourci: number;
    isActif?:boolean;
}