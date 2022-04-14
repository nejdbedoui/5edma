import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ProdcutResponse } from '../../../model/response/ProdcutResponse';
import { Prodcut } from '../../../model/Product';
import {OneProductResponse} from "../../../model/response/OneProductResponse";
import { ProductCategorieArticleidDto } from '../../../model/dto/ProductCategorieArticleidDto';
import { Productsdto } from '../../../model/dto/Productsdto';
import { ListProductDto } from '../../../model/dto/ListProductDto';
import { Ingredient } from '../../../model/Ingredient';
import { Famille } from '../../../model/Famille';

@Injectable({
  providedIn: 'root'
})
export class ProductEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

findAllProductShortCutByIdPointVente(idpointvente:string){
  return this.httpclient.get<ProdcutResponse>(environment.backend_url_Product+"findAllProductShortCutByIdPointVente/"+idpointvente,{ headers: this.header });
}
  createProduct(produit:Prodcut){
    return this.httpclient.post<OneProductResponse>(environment.backend_url_Product+"createProduct",produit,{ headers: this.header });
  }

  findAllByTypeProduit(type:string){
    return this.httpclient.get<ProdcutResponse>(environment.backend_url_Product+"findAllByTypeProduit/"+type,{ headers: this.header });
  }

  findproduitByIdProduit(id:string){
    return this.httpclient.get<any>(environment.backend_url_Product+"findproduitByIdProduit/"+id,{ headers: this.header });
  }

  findAllByPartenaire(idPartenaire:string){
    return this.httpclient.get<ProdcutResponse>(environment.backend_url_Product+"findAllByPartenaire/"+idPartenaire,{ headers: this.header });
  }

  deleteProduct(id:string){
    return this.httpclient.delete<any>(environment.backend_url_Product+"deleteProduct/"+id,{ headers: this.header });
  }

  DeleteIngredient(id:string){
    return this.httpclient.delete<any>(environment.backend_url_Product+"deleteIngredient/"+id,{ headers: this.header });
  }

  updateProduct(produit:Prodcut){
    return this.httpclient.post<OneProductResponse>(environment.backend_url_Product+"updateProduct",produit,{ headers: this.header });
  }
  createProductwithaffectation(productsdto:Productsdto){
    return this.httpclient.post<OneProductResponse>(environment.backend_url_Product+"createProductwithaffectation",productsdto,{ headers: this.header });

  }
  findAllByPartenairewithcategorie(idPartenaire:string){
    return this.httpclient.get<any>(environment.backend_url_Product+"findAllByPartenairewithcategorie/"+idPartenaire,{ headers: this.header });

  }
  findAllProductByIdCategorieArticleAndIdPointVente(idcategorie,idpv){
    return this.httpclient.get<any>(environment.backend_url_Product+"findAllProductByIdCategorieArticleAndIdPointVente/"+idcategorie+"/"+idpv,{ headers: this.header });
  
  }
  findAllProductByIdCategorieArticle(idcategorie){
    return this.httpclient.get<any>(environment.backend_url_Product+"findAllProductByIdCategorieArticle/"+idcategorie,{ headers: this.header });
  
  }

  updateproduitcategorievuecaisse(productsdto:ListProductDto){
    return this.httpclient.post<any>(environment.backend_url_Product+"updateproduitcategorievuecaisse",productsdto,{ headers: this.header });

  }
  createIngredient(ingredient:Ingredient){
    return this.httpclient.post<any>(environment.backend_url_Product+"createIngredient",ingredient,{ headers: this.header });
  }

  findIngredientByIdIngredient(ingredientId:string){
    return this.httpclient.get<any>(environment.backend_url_Product+"findIngredient/"+ingredientId,{ headers: this.header });
  }
  findAllIngredientByPartenaire(idPartenaire:string){
    return this.httpclient.get<any>(environment.backend_url_Product+"findAllIngredientByPartenaire/"+idPartenaire,{ headers: this.header });
  }
  findAllByIdPartenaireAndFPrimaire(idPartenaire:string,fprimaire:number){
    return this.httpclient.get<any>(environment.backend_url_Product+"findAllByIdPartenaireAndFPrimaire/"+idPartenaire+"/"+fprimaire,{ headers: this.header });
  }

  findAllFamilleByPartenaire(idPartenaire:string){
    return this.httpclient.get<any>(environment.backend_url_Product+"findAllFamilleByPartenaire/"+idPartenaire,{ headers: this.header });
  }

  createFamille(famille:Famille){
    return this.httpclient.post<any>(environment.backend_url_Product+"createFamille",famille,{ headers: this.header });
  }

  DeleteFamille(id:string){
    return this.httpclient.delete<any>(environment.backend_url_Product+"deleteFamille/"+id,{ headers: this.header });
  }
}
