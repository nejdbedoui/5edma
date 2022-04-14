import { AccessPermissions } from "./AccessPermissions";

export class Utilisateur{
  dateCreation: Date;
  email: string;
  fActif: number;
  idPartenaire: string;
  idProfil: string;
  idTypeUtilisateur: string;
  idUtilisateur: string;
  identifiant: string;
  login: string;
  matricule: string;
  nom: string;
  password: string;
  prenom: string;;
  idPointVente:string;
  isvalidated:number;
  sexe: string;
  tel: string;
  adresse: string;
  accessPermissions: AccessPermissions;
}