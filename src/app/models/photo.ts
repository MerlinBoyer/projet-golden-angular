import { Album } from './album';

export class Photo {
    id:number;
    name: String;
    image: File;
    comments: Array<String>;
    size: number;
    dateCreation: Date;
    nbDownloads: number;
    album: Album;

    

    constructor(name: String, size: number){
        this.name = name;
        this.size = size;
        this.comments = [];
        this.dateCreation = new Date();
        this.nbDownloads = 0;
    }
}