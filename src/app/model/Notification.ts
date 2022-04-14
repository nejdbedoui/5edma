import {ImagesNotif} from "./ImagesNotif";

export class Notification {
   idNotification :  string;
   idPartenaire :  string;
   typeNotification :  string;
   titre :  string;
   body :  string;
   description :  string;
   isActif : number;
   dateCreation :  Date;
   dateDebut : Date;
   dateFin :  Date;
   imagesNotif : ImagesNotif;
   imageNotif : ImagesNotif;
   isSlider : number;
}
