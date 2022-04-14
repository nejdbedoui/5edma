import { Categorie } from '../Categorie';
import { PointVentevisible } from './PointVentevisible';
export class categoryProductDto{
    categorieArticle: Categorie;
    productIds: string[];
      idPointVentevisible: PointVentevisible[];
}