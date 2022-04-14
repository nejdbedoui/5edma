import { Prodcut } from '../Product';
import { Categorie } from '../Categorie';
import { ProduitDto } from './ProduitDto';

export class CategoryArticleProductDto{
    categorieArticle: Categorie;
      products: ProduitDto[];
}