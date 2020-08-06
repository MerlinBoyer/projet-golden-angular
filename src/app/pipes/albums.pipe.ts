import { Pipe, PipeTransform } from '@angular/core';
import { Album } from '../models/album';

@Pipe({
  name: 'albumsSearch'
})
export class AlbumsPipe implements PipeTransform {

  transform(items: Album[], text: string) {

    if(!text || text === "") return items;

    if(text != ""){
      items = this.filtrerParMotClef(items, text);
    }

    return items;
  }

  filtrerParMotClef(items: Album[], text: string){
    //first create an array with keywords
    let textArr =  text.split(/(\s+)/).filter( e => e.trim().length > 0);

    return items.filter(item => {

      // need to instanciate result otherwise foreach is treated in async mode
      var result = false;
      textArr.forEach(keyWord => {
        if(item.name.includes(keyWord)){
          result = true;
        }
      })
      return result;
    });
  }


}
