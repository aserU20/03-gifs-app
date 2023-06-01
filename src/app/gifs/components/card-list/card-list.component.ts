import { Component, Input } from '@angular/core';
import { Gif } from '../../interfaces/gifs.interface';

@Component({
  selector: 'gifs-card-list',
  templateUrl: './card-list.component.html'
})

export class CardListComponent {
  constructor() { }

  @Input()
  public gifs: Gif[] = [];
}
