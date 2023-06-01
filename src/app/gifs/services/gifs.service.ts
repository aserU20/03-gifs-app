import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Gif, SearchResponse } from "../interfaces/gifs.interface";

@Injectable({ providedIn: 'root' })
export class GifsService {

  public gifsList: Gif[] =[];

  private _tagHistory: string[] = [];
  private apiKey:      string = '40xAWO8Dak6GOT0KvTLXRsfOGMoRZajI';
  private serviceURL:  string = 'https://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient) {
    this.loadLocalStorage();

  }

  get tagsHistory() {
    return [...this._tagHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if(this._tagHistory.includes(tag)) {
      this._tagHistory = this._tagHistory.filter( (oldTag) => oldTag !== tag);
    }

    this._tagHistory.unshift(tag);
    this._tagHistory = this.tagsHistory.splice(0, 10);

    this.saveLocalStorage();
  }

  private saveLocalStorage():void {
    localStorage.setItem('history', JSON.stringify(this._tagHistory));
  }

  private loadLocalStorage():void {
    if( !localStorage.getItem('history') ) return;

    this._tagHistory = JSON.parse( localStorage.getItem('history')! );

    if( this._tagHistory.length === 0 ) return;

    this.searchTag( this._tagHistory[0] );
  }

  // TODO METHOD 1

  // async searchTag(tag: string): Promise<void> {
  //   if(tag.length === 0) return;

  //   this.organizeHistory(tag);

  //   fetch('https://api.giphy.com/v1/gifs/search?api_key=40xAWO8Dak6GOT0KvTLXRsfOGMoRZajI&q=valorant&limit=10')
  //   .then (resp => resp.json())
  //   .then (data => console.log(data));
  // }

  // TODO METHOD 2 con angular HttpClienteModule
  searchTag(tag: string): void {
    if(tag.length === 0) return;

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', tag)

    this.organizeHistory(tag);

    this.http.get<SearchResponse>(`${ this.serviceURL }/search`, { params })
      .subscribe(resp => {
        this.gifsList = resp.data;

        // console.log({gifs: this.gifsList})
      });
  }
}
