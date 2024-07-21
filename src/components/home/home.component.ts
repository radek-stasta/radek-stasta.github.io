import {
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { DataService } from '../../services/data/data.service';
import { NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgOptimizedImage, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
})
export class HomeComponent {
  @ViewChild('mainDiv', { static: false }) mainDiv!: ElementRef;

  constructor(
    private _dataService: DataService,
    private _renderer: Renderer2,
  ) {}
}
