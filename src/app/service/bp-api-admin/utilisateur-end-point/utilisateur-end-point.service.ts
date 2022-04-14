import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { UtilisateurResponse } from '../../../model/response/UtilisateurResponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OneUtilisateurResponse } from '../../../model/response/OneUtilisateurResponse';
import { Utilisateur } from '../../../model/Utilisateur';
import { ResetPasswordDto } from '../../../model/dto/ResetPasswordDto';
import { TableReservationDto } from '../../../model/TableReservationDto';
import { AccessPermissions } from '../../../model/AccessPermissions';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurEndPointService {

  constructor(private httpclient: HttpClient) { }

  header = new HttpHeaders(
    {
      'Access-Control-Allow-Origin': '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'
    }
  );

  CreateUtilisateur(user: Utilisateur) {
    return this.httpclient.post<OneUtilisateurResponse>(environment.backend_url_Admin + "CreateUtilisateur", user, { headers: this.header });
  }

  Editpaaswor(resetPasswordDto: ResetPasswordDto) {
    return this.httpclient.post<OneUtilisateurResponse>(environment.backend_url_Admin + "Editpaaswor", resetPasswordDto, { headers: this.header });

  }
  findUtilisateurByIdUtilisateur(id: string) {
    return this.httpclient.get<OneUtilisateurResponse>(environment.backend_url_Admin + "findUtilisateurByIdUtilisateur/" + id, { headers: this.header });
  }

  findAllByIdPointVente(idPointVente: string) {
    return this.httpclient.get<UtilisateurResponse>(environment.backend_url_Admin + "findAllByIdPointVente/" + idPointVente, { headers: this.header });
  }

  DeleteUtilisateur(idUtilisateur: string) {
    return this.httpclient.delete<any>(environment.backend_url_Admin + "DeleteUtilisateur/" + idUtilisateur, { headers: this.header });
  }

  findfreeemplyeebyreservation(tableReservationDto: TableReservationDto) {
    return this.httpclient.post<UtilisateurResponse>(environment.backend_url_Admin + "findfreeemplyeebyreservation", tableReservationDto, { headers: this.header });
  }
  UpdateUtilisateur(user: Utilisateur) {
    return this.httpclient.put<OneUtilisateurResponse>(environment.backend_url_Admin + "UpdateUtilisateur", user, { headers: this.header });
  }

  updateaccesspermissions(userId: string, accessPermissions: AccessPermissions) {
    return this.httpclient.put<any>(environment.backend_url_Admin + "updateaccesspermissions/" + userId,
      accessPermissions, { headers: this.header });
  }
}
