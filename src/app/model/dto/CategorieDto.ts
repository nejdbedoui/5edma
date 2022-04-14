export class CategorieDto{
      idCategorie: string;
      idPartenaire: string;
      idCetgorieMere: string;
      designation: string;
      description:string;
      photo: string;
      dateCreation: Date;
      fActif: number;
      fils:CategorieDto[];
      couleur:string;
      order:number;
}