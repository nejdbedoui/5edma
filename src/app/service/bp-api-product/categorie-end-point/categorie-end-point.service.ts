import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CategorieDtoResponse } from '../../../model/response/CategorieDtoResponse';
import { categoryProductDto } from '../../../model/dto/categoryProductDto';
import { categoryProductDtoResponse } from '../../../model/response/categoryProductDtoResponse';
import { ListCategorieDto } from '../../../model/dto/ListCategorieDto';

@Injectable({
  providedIn: 'root'
})
export class CategorieEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

listcategorieArticleForPointVente(idpointvente:string){
  return this.httpclient.get<CategorieDtoResponse>(environment.backend_url_Product+"listcategorieArticleForPointVente/"+idpointvente,{ headers: this.header });
}
createCategorieArticle(categorieprodiuct:categoryProductDto){
  return this.httpclient.post<any>(environment.backend_url_Product+"createCategorieArticle",categorieprodiuct,{ headers: this.header });

}
findbyidCategorie(id:string){
  return this.httpclient.get<categoryProductDtoResponse>(environment.backend_url_Product+"findbyidCategorie/"+id,{ headers: this.header });

}
findAllCategorieByIdpartenaire(id:string){
  return this.httpclient.get<any>(environment.backend_url_Product+"findAllCategorieByIdpartenaire/"+id,{ headers: this.header });

}
affecteProduitToCateogrie(idCategoriearticle:string,idPointVente:string,idProduits:string[]){
  return this.httpclient.post<any>(environment.backend_url_Product+"affecteProduitToCateogrie/"+idCategoriearticle+'/'+idPointVente,idProduits,{ headers: this.header });
}
findbyidCategorieAndIdpointVente(idCategoriearticle:string,idPointVente:string){
  return this.httpclient.get<any>(environment.backend_url_Product+"findbyidCategorieAndIdpointVente/"+idCategoriearticle+'/'+idPointVente,{ headers: this.header });
}
findchildbyidCategorieAndIdpointVente(idCategoriearticle:string,idPointVente:string){
  return this.httpclient.get<any>(environment.backend_url_Product+"findchildbyidCategorieAndIdpointVente/"+idCategoriearticle+'/'+idPointVente,{ headers: this.header });
}
findAllCategoriesbyidcategorie(idCategoriearticle:string){
  return this.httpclient.get<any>(environment.backend_url_Product+"findAllCategoriesbyidcategorie/"+idCategoriearticle,{ headers: this.header });
}

updateCategorieArticle(categorieprodiuct:categoryProductDto){
  return this.httpclient.post<any>(environment.backend_url_Product+"updateCategorieArticle",categorieprodiuct,{ headers: this.header });

}
findAllCategArticlewithchildByIdpartenaire(idPartenaire:string){
  return this.httpclient.get<any>(environment.backend_url_Product+"findAllCategArticlewithchildByIdpartenaire/"+idPartenaire,{ headers: this.header });

}
findAllCategoriesbyidproduit(idproduit,idpv){
  return this.httpclient.get<any>(environment.backend_url_Product+"findAllCategoriesbyidproduit/"+idproduit+"/"+idpv,{ headers: this.header });
}

updatecategorievuecaisse(listCategorieDto:ListCategorieDto){
  return this.httpclient.post<any>(environment.backend_url_Product+"updatecategorievuecaisse",listCategorieDto,{ headers: this.header });
}

findAllCategoryByIdpartenaire(id:string){
  return this.httpclient.get<any>(environment.backend_url_Product+"findAllCategoryByIdpartenaire/"+id,{ headers: this.header });

}

}
