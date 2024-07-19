import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { DataService } from '../../services/data/data.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('mainDiv', { static: false }) mainDiv!: ElementRef;

  constructor(
    private _dataService: DataService,
    private _renderer: Renderer2,
  ) {}

  ngAfterViewInit() {
    const height = `calc(100vh - ${this._dataService.headerHeight}px)`;
    this._renderer.setStyle(this.mainDiv.nativeElement, 'height', height);
  }
}
