import { Photo } from './photo';

export class Album {

    id: number;
    pictures: Array<Photo>;
    path: String;
    name: String;
    visibility: number;
    code: String;
    nb_visits: number;
    description: String;
    creation_date: Date;

}
