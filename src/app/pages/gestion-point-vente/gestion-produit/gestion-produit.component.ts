import { Component, OnInit } from '@angular/core';
import { ProductEndPointService } from '../../../service/bp-api-product/product-end-point/product-end-point.service';
import { Prodcut } from '../../../model/Product';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';
import * as uuid from 'uuid';
import { ProductCategorieArticleidDto } from '../../../model/dto/ProductCategorieArticleidDto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReglesFideliteProduitEndPointService } from '../../../service/bp-api-loyality/regles-fidelite-produit-end-point/regles-fidelite-produit-end-point.service';
import { ReglesFideliteProduit } from '../../../model/ReglesFideliteProduit';
import { DeviseEndPointService } from '../../../service/bp-api-pos/devise-end-point/devise-end-point.service';
import { Devise } from '../../../model/Devise';
import { Categorie } from '../../../model/Categorie';
import { CategorieEndPointService } from '../../../service/bp-api-product/categorie-end-point/categorie-end-point.service';
import { filter } from 'rxjs/operators';
import { DateService } from '../../../service/GlobalService/DateSevice/date.service';
import { formatDate } from '@angular/common';
import { Exportproduit } from '../../../model/Exportproduit';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ListCategorieDto } from '../../../model/dto/ListCategorieDto';
import { ListProductDto } from '../../../model/dto/ListProductDto';


@Component({
  selector: 'ngx-gestion-produit',
  templateUrl: './gestion-produit.component.html',
  styleUrls: ['./gestion-produit.component.scss']
})
export class GestionProduitComponent implements OnInit {


  constructor(private _ProductEndPointService: ProductEndPointService, private router: Router,
    private _GlobalService: GlobalServiceService, private _FormBuilder: FormBuilder,
    private _ReglesFideliteProduitEndPointService: ReglesFideliteProduitEndPointService,
    private _DeviseEndPointService: DeviseEndPointService,
    private _CategorieEndPointService: CategorieEndPointService,
    private _DateService: DateService) { }
  articleTypes = [{ label: 'Stockable', value: 'stockable' }, { label: 'Consommable', value: 'consommable' }, { label: 'Service', value: 'service' }];
  loading: boolean = true
  hide: boolean = true
  listproduit: any[] = []
  listproduit2: any[] = []
  diplayproduit: boolean = false
  cols2: any[]
  cols3: any[]
  diplayfid: boolean = false
  fidForm: FormGroup;
  isSubmitted: boolean = false
  listdevise: Devise[] = []
  categories: Categorie[] = []
  public calendar: any;
  affichefilter: boolean = false
  listselectcateg: Categorie[] = []
  deprix: number
  aprix: number
  datecreation: Date
  notaffectedtocateg: boolean = false
  repturedestock: boolean = false
  presquerepturestock: boolean = false
  aveccodeinterne: boolean = false
  fannule: boolean = false
  public placeholder: string = "designation";
  public keyword = 'designation';
  calendar_fr = {
    closeText: "Fermer",
    prevText: "Précédent",
    nextText: "Suivant",
    currentText: "Aujourd'hui",
    monthNames: ["janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    monthNamesShort: ["janv.", "févr.", "mars", "avr.", "mai", "juin",
      "juil.", "août", "sept.", "oct.", "nov.", "déc."],
    dayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
    dayNamesShort: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
    dayNamesMin: ["D", "L", "M", "M", "J", "V", "S"],
    weekHeader: "Sem.",
    dateFormat: "dd-mm-yy",
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ""
  };
  isSubmit: boolean = false
  choosecatagrie: boolean = false
  ngOnInit() {

    this.calendar = this.calendar_fr
    this.fidForm = this._FormBuilder.group({
      designation: ['', [Validators.required]],
      valeur: ['', [Validators.required]],
      devise: ['', [Validators.required]],
    })
    this.cols2 = [
      { field: 'produit', header: 'Désignation' },
      { field: 'produit', header: 'Code a Barre' },
      { field: 'produit', header: 'DateCreation' },
      { field: 'produit', header: 'Composition' },
      { field: 'produit', header: 'Composition' },
      { field: 'produit', header: 'Composition' },
      { field: 'produit', header: 'Composition' },
      { field: 'produit', header: 'Composition' },
      { field: 'Action', header: 'Action' },
    ];
    this.cols3 = [
      { field: 'Quantite', header: 'Quantite' },
      { field: 'Valeur', header: 'Valeur' },
      { field: 'Pourcentage', header: 'Pourcentage' },
      { field: 'Action', header: 'Action' },
    ];

    // this._DeviseEndPointService.findAllByIdPointVenteAndFDefaut(localStorage.getItem("partenaireid"),1).subscribe(el=>{
    //   console.log(el.objectResponse);
    //   if(el.objectResponse!=null){
    //     this.listdevise=el.objectResponse

    //   }else{
    //     this.listdevise=[]
    //   }


    // })

    let devise: Devise = new Devise()
    devise.designation = "%"
    this.listdevise.push(devise)
    let devise2: Devise = new Devise()
    devise2.designation = "Montant"
    this.listdevise.push(devise2)
    console.log(this.listdevise);
    this._CategorieEndPointService.findAllCategArticlewithchildByIdpartenaire(localStorage.getItem("partenaireid")).subscribe(val1 => {
      this.categories = val1.objectResponse
      console.log(this.categories);

      this._ProductEndPointService.findAllByPartenairewithcategorie(localStorage.getItem("partenaireid")).subscribe(val => {
        console.log(val);

        if (val.result == 1) {
          this.loading = false
          this.listproduit = val.objectResponse
          this.listproduit.reverse()
          this.listproduit.forEach(el => {
            this.listproduit2.push(el)
          })
        } else {
          this.loading = false
          this.listproduit = []
        }
      }, err => {
        this.loading = false
        this.listproduit = []
      })
    })
  }
  get formControls() { return this.fidForm.controls; }

  choosetype(event) {
    console.log(event);
    this.loading = true
    this.hide = false

  }
  currentregle: Prodcut = new Prodcut()
  diplayregle: boolean = false
  redirect() {
    this.router.navigateByUrl("/pages/Pointvente/gestionProduit/NouveauProduit")
  }
  getname(idcatagorie) {
    let listcata: any = this.categories.filter(el => el.idCategorie == idcatagorie)
    if (listcata != null) {
      return listcata[0] != null ? listcata[0].designation : ''
    } else {
      return ''
    }
  }
  getproduitname(idp) {
    return this.listproduit.filter(el => el.idProduit == idp)[0].designation
  }
  edits(produit: Prodcut) {
    this.router.navigateByUrl("/pages/Pointvente/gestionProduit/ModifierProduit/" + produit.idProduit)
  }
  deletes(prdouit: Prodcut) {
    this.currentregle = prdouit
    this.diplayregle = true

  }
  deleteproduit() {
    this.listproduit = this.listproduit.filter(val => val.produit.idProduit != this.currentregle.idProduit)
    console.log(this.currentregle);

    this._ProductEndPointService.deleteProduct(this.currentregle.idProduit).subscribe(val => {
      console.log(val);
      if (val.result == 1) {
        this.diplayregle = false
        this._GlobalService.showToast("success", "success", "le produit a ete supprimé avec succès")
      } else {
        this.diplayregle = false
        this._GlobalService.showToast("danger", "Erreur", val.errorDescription)

      }
    }, erreur => {
      this._GlobalService.showToast("danger", "Erreur", "erreur")

    })
  }
  deleteimportedproduit() {
    this.importedproducts = this.importedproducts.filter(val => val.idProduit != this.idcurrentImportedproduct)
  }
  deletesimport(product: Prodcut) {
    this.idcurrentImportedproduct = product.idProduit
    this.diplay2 = true
  }
  importedproducts: Prodcut[] = []
  idcurrentImportedproduct: string = ""
  filevalue: any
  diplay2: boolean = false
  onFileChange(ev) {
    console.log("***************");
    this.filevalue = null
    this.importedproducts = []
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        jsonData = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        console.log(jsonData.Feuil1);
        let datas = jsonData.Feuil1
        let correctfile = true
        datas.forEach(element => {
          let produit: Prodcut = new Prodcut()

          if (element.TypeProduit != "stockable" && element.TypeProduit != "consommable" && element.TypeProduit != "service") {
            produit.typeProduit = ''
          } else {
            produit.typeProduit = element.TypeProduit

          }
          if ((element.Désignation == "" || element.Désignation == null)) {
            correctfile = false
          }
          produit.designation = element.Désignation
          produit.description = element.Description
          produit.prixHt = element.prixHt
          produit.prixTtc = element.prixTtc
          produit.code = element.Désignation
          produit.codeBarre = element.CodeBarre
          produit.dateCreation = new Date()
          produit.idProduit = uuid.v4()
          produit.idPartenaire = localStorage.getItem("partenaireid")
          this.importedproducts.push(produit)
        });
        if (correctfile) {
          this.diplayproduit = true
        } else {
          this.importedproducts = []
          this._GlobalService.showToast('danger', 'Erreur', "Veuillez verifier les informations du fichier excel")
        }
      }
      reader.readAsBinaryString(file);

    } else {
      this._GlobalService.showToast('danger', 'Erreur', "Veuillez Importer un fichier Excel")

    }

  }

  annulerproduit() {
    this.importedproducts = []
    this.filevalue = null
  }
  saveimported() {
    let correctfile = true
    this.importedproducts.forEach(element => {
      if (element.typeProduit != "stockable" && element.typeProduit != "consommable" && element.typeProduit != "service") {
        element.typeProduit = ''
      }
      if ((element.designation == "" || element.designation == null)) {
        correctfile = false
      }
    })
    if (correctfile) {
      let i: number = 0
      this.importedproducts.forEach(element => {
        let productCategorieArticleidDto: ProductCategorieArticleidDto = new ProductCategorieArticleidDto()
        productCategorieArticleidDto.categorieArticleProduits = []
        element.idProduit = null
        productCategorieArticleidDto.produit = element
        productCategorieArticleidDto.stockactual = 0
        console.log(productCategorieArticleidDto);

        this._ProductEndPointService.createProduct(element).subscribe(val => {
          console.log(val);
          if (val.result == 1) {
            productCategorieArticleidDto.produit = val.objectResponse
            this.listproduit.push(productCategorieArticleidDto)
            console.log(this.listproduit);
            console.log(this.listproduit.length);
            i = i + 1;
          } else {
            this._GlobalService.showToast('danger', 'Erreur', val.errorDescription)

          }
          if (i == this.importedproducts.length) {
            this._GlobalService.showToast('success', 'Succès', "les produits ont été importé avec succés")
            this.diplayproduit = false
            this.listproduit = [...this.listproduit];
          }

        }, erreur => {
          this._GlobalService.showToast('danger', 'Erreur', erreur)

        })
      })
    }
  }

  deletefeed() {

  }
  listregfid: ReglesFideliteProduit[] = []
  currentreglefid: any
  qantitefid: number = 0
  createfid(product: any, id) {
    console.log(product);
    console.log(id);

    this.currentreglefid = product
    this.qantitefid = this.currentreglefid.produitsCombines != null ? this.currentreglefid.produitsCombines.filter(val => val.idProduit == id)[0].quantite : ''
    this.diplayfid = true
    // this._ReglesFideliteProduitEndPointService.findAllReglesFideliteProduitByIdProduit(product.idProduit).subscribe(val=>{
    //   if(val.objectResponse!=null){
    //     this.listregfid=val.objectResponse
    //   }else{
    //     this.listregfid=[]
    //   }
    //   this.diplayfid=true
    // })

  }

  deletereglefid() {
    this._ReglesFideliteProduitEndPointService.DeleteReglesFideliteProduit(this.cuurentreg.idRegle).subscribe(val => {
      if (val.result == 1) {
        this.listregfid = this.listregfid.filter(el => el.idRegle != this.cuurentreg.idRegle)
        this._GlobalService.showToast('success', "success", "La Régle de fidelite a été supprimer avec succès");
        this.diplay2reg = false
      } else {
        this._GlobalService.showToast('danger', "Erreur", val.errorDescription);
        this.diplay2reg = false
      }
    })

  }
  createnewfid() {
    this.isSubmitted = true
    if (this.fidForm.invalid) {
      return
    } else {
      console.log(this.fidForm.value);
      let reglefid: ReglesFideliteProduit = new ReglesFideliteProduit()
      reglefid.idProduit = this.currentregle.idProduit
      reglefid.fPourcentage = this.fidForm.value.devise == "%" ? 1 : 0
      reglefid.quantite = this.fidForm.value.designation
      reglefid.valeur = this.fidForm.value.valeur
      if (this.cuurentreg != null) {
        reglefid.idRegle = this.cuurentreg.idRegle
        this.listregfid = this.listregfid.filter(el => el.idRegle != this.cuurentreg.idRegle)
      }
      console.log(this.cuurentreg);

      this._ReglesFideliteProduitEndPointService.CreateReglesFideliteProduit(reglefid).subscribe(val => {
        console.log(reglefid);
        this.listregfid.push(val.objectResponse)
        if (val.result == 1) {
          this.addfid = false
          if (this.cuurentreg == null) {
            this._GlobalService.showToast('success', "success", "La Régle de fidelite a été créer avec succès");

          } else {
            this._GlobalService.showToast('success', "success", "La Régle de fidelite a été modifier avec succès");

          }
          //this.fidForm.reset()
        } else {
          this._GlobalService.showToast('danger', "Erreur", val.errorDescription);
        }
      }, errer => {
        this._GlobalService.showToast('danger', "Erreur", "Erreur");
      })

    }

  }

  exportExcel() {

    let exportproduits: Exportproduit[] = []
    this.listproduit.forEach(el => {
      let exportproduit: Exportproduit = new Exportproduit()
      exportproduit.designation = el.produit.designation
      exportproduit.code_a_Barre = el.produit.codeBarre

      let concatstring: string = ""
      el.categorieArticleProduits.forEach(item => {
        concatstring = concatstring + ";" + this.getname(item.idCategArticle)
      });
      exportproduit.categorie = concatstring

      exportproduit.stockdepart = el.produit.stockQteDepart
      exportproduit.stockActuel = el.stockactual
      exportproduit.stockLimite = el.produit.stockAlert
      exportproduit.prix = el.produit.prixTtc
      exportproduit.tva = el.produit.tva
      exportproduits.push(exportproduit)
    })

    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(exportproduits);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "produits");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + formatDate(new Date(), 'dd_MM_yyyy_hh_mm', 'en-US') + EXCEL_EXTENSION);
    });
  }

  annuler() {
    this.listproduit = []
    this.listproduit2.forEach(el => {
      this.listproduit.push(el)
    })
  }
  findchild(idmere: string, idchild: string) {
    return this.categories.filter(val => val.idCetgorieMere == idmere && val.idCategorie == idchild).length > 0
  }
  search() {
    this.annuler()
    console.log(this.listselectcateg, this.deprix, this.aprix, this.datecreation, this.notaffectedtocateg, this.repturedestock, this.presquerepturestock, this.aveccodeinterne);
    this.fannule = true
    if (this.listselectcateg != null && this.listselectcateg.length > 0) {
      if (this.deprix != null) {
        if (this.aprix != null) {
          if (this.datecreation != null) {
            if (this.notaffectedtocateg) {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0)

                  }
                }
              }
            } else {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel)
                  }
                }
              }
            }
          } else {
            if (this.notaffectedtocateg) {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0)

                  }
                }
              }
            } else {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix)

                  }
                }
              }
            }
          }
        } else {
          if (this.datecreation != null) {
            if (this.notaffectedtocateg) {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0)

                  }
                }
              }
            } else {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel)
                  }
                }
              }
            }
          } else {
            if (this.notaffectedtocateg) {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.categorieArticleProduits.length == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.categorieArticleProduits.length == 0)

                  }
                }
              }
            } else {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.referenceInterne != null)

                  } else {
                    console.log('6666666666666666666666');

                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix)

                  }
                }
              }
            }
          }
        }
      } else {
        if (this.aprix != null) {
          if (this.datecreation != null) {
            if (this.notaffectedtocateg) {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0)

                  }
                }
              }
            } else {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel)
                  }
                }
              }
            }
          } else {
            if (this.notaffectedtocateg) {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0)

                  }
                }
              }
            } else {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix)

                  }
                }
              }
            }
          }
        } else {
          if (this.datecreation != null) {
            if (this.notaffectedtocateg) {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0)

                  }
                }
              }
            } else {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel)
                  }
                }
              }
            }
          } else {
            if (this.notaffectedtocateg) {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.categorieArticleProduits.length == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.categorieArticleProduits.length == 0)

                  }
                }
              }
            } else {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0 && el.produit.referenceInterne != null)

                  } else {
                    console.log("****************");
                    console.log(this.listproduit);
                    console.log(this.listselectcateg);

                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.filter(val => this.listselectcateg.filter(vall => vall.idCategorie == val.idCategArticle || this.findchild(vall.idCategorie, val.idCategArticle)).length > 0).length > 0)

                  }
                }
              }
            }
          }
        }
      }
    } else {
      if (this.deprix != null) {
        if (this.aprix != null) {
          if (this.datecreation != null) {
            if (this.notaffectedtocateg) {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0)

                  }
                }
              }
            } else {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel)
                  }
                }
              }
            }
          } else {
            if (this.notaffectedtocateg) {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.categorieArticleProduits.length == 0)

                  }
                }
              }
            } else {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.prixTtc < this.aprix)

                  }
                }
              }
            }
          }
        } else {
          if (this.datecreation != null) {
            if (this.notaffectedtocateg) {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0)

                  }
                }
              }
            } else {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel)
                  }
                }
              }
            }
          } else {
            if (this.notaffectedtocateg) {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.categorieArticleProduits.length == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.categorieArticleProduits.length == 0)

                  }
                }
              }
            } else {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc > this.deprix)

                  }
                }
              }
            }
          }
        }
      } else {
        if (this.aprix != null) {
          if (this.datecreation != null) {
            if (this.notaffectedtocateg) {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0)

                  }
                }
              }
            } else {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel)
                  }
                }
              }
            }
          } else {
            if (this.notaffectedtocateg) {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.length == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.length == 0)

                  }
                }
              }
            } else {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => true)

                  }
                }
              }
            }
          }
        } else {
          if (this.datecreation != null) {
            if (this.notaffectedtocateg) {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.categorieArticleProduits.length == 0)

                  }
                }
              }
            } else {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.produit.dateCreation) && el.produit.stockAlert >= el.produit.stockReel)
                  }
                }
              }
            }
          } else {
            if (this.notaffectedtocateg) {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.length == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.length == 0 && el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.length == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.categorieArticleProduits.length == 0)

                  }
                }
              }
            } else {
              if (this.repturedestock) {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.stockReel == 0 && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.stockReel == 0)

                  }
                }
              } else {
                if (this.presquerepturestock) {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  } else {
                    this.listproduit = this.listproduit.filter(el => el.produit.stockReel == 0 && el.produit.stockAlert >= el.produit.stockReel && el.produit.referenceInterne != null)

                  }
                } else {
                  if (this.aveccodeinterne) {
                    this.listproduit = this.listproduit.filter(el => el.produit.referenceInterne != null)

                  } else {
                    this.annuler()

                  }
                }
              }
            }
          }
        }
      }
    }

  }
  resetform() {
    this.fidForm.reset()
    this.cuurentreg = null
    this.isSubmitted = false
  }
  cuurentreg: ReglesFideliteProduit = null
  editsreg(reg: ReglesFideliteProduit) {
    this.cuurentreg = reg
    console.log(reg.fPourcentage == 1 ? this.listdevise.filter(val => val.designation == '%')[0] : this.listdevise.filter(val => val.designation != '%')[0]);

    this.fidForm = this._FormBuilder.group({
      designation: [reg.quantite, [Validators.required]],
      valeur: [reg.valeur, [Validators.required]],
      devise: [reg.fPourcentage == 1 ? this.listdevise.filter(val => val.designation == '%')[0].designation : this.listdevise.filter(val => val.designation != '%')[0].designation, [Validators.required]],
    })
    this.addfid = true
  }
  diplay2reg: boolean = false
  deletesreg(reg: ReglesFideliteProduit) {
    this.cuurentreg = reg
    this.diplay2reg = true
  }
  addfid: boolean = false

  filtercriter() {

  }

  autocomp: boolean = false
  cata: any
  selectEvent(item) {
    console.log(item);
    if (item != null) {
      this.cata = item
    } else {
      this.cata = null
    }
  }
  onChangeSearch(event) {
    console.log(event);

    // if(event!=null){
    //    this.cata=event
    // }else{
    //   this.cata=null
    // }

    this.autocomp = false
  }
  cleardata() {
    // this.fournisseurDto=new FournisseurDto()
    this.autocomp = false

  }
  listproductcategiorie: any[] = []
  listprod: boolean = false
  produitdtosnotselected: any[] = []
  produitdtosselected: any[] = []
  choosecata() {
    this.isSubmit = true
    console.log(this.cata);

    if (this.cata != null) {
      this.choosecatagrie = false

      this._ProductEndPointService.findAllProductByIdCategorieArticle(this.cata.idCategorie).subscribe(val => {
        console.log(val);
        this.listprod = true
        this.done = []
        this.listproductcategiorie = val.objectResponse
        this.produitdtosnotselected = this.listproductcategiorie.filter(el => el.order == null);
        this.done = this.listproductcategiorie.filter(el => el.order != null).sort((a, b) => a.order - b.order);
        this.produitdtosselected = this.listproductcategiorie.filter(el => el.order != null).sort((a, b) => a.order - b.order);

      })
    } else {
      this.choosecatagrie = true
    }
  }

  done: any[] = [];

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

    console.log(this.listproductcategiorie);
    console.log(this.done);

  }

  diplay: boolean = false;
  validerlist() {
    let listcat: ListProductDto = new ListProductDto()
    listcat.affected = this.done
    listcat.deleted = this.produitdtosnotselected.filter(el => !(this.done.filter(val => val.idProduit == el.idProduit).length > 0))
    console.log(listcat);

    this._ProductEndPointService.updateproduitcategorievuecaisse(listcat).subscribe(val => {
      this.loading = true
      if (val.result == 1) {
        this._GlobalService.showToast("success", "Succès", 'liste produit est modifier avec succès');
        this.loading = false

        // this.productForm.reset();
      } else {
        this._GlobalService.showToast('danger', "Echec", val.errorDescription);
        this.loading = false
      }
    }, erreur => {
      this._GlobalService.showToast('danger', "Echec", "Un problème de connection est survenue, Veuillez réessayer ulterieurement");
      this.loading = false
    });
  }
}
