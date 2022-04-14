import { Quantite } from '../Quantite';
export class ReservationDto{
  dateReseravation: Date;
  //dateFinReseravation:Date;
  fTraite: number;
  idConsommateur: string;
  idEmployeeService: string;
  idPointVente: string;
  idReservation: string;
  idSession: string;
  idTable: string;
  nbrPers: number;
  src: string;
  produitsQtes:Quantite[]
  calledfrom: string= "BO"
}