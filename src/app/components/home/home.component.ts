import { Component, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
})
export class HomeComponent implements OnInit {
  protected ssgTestMessage = '';

  ngOnInit() {
    console.log('on init');
    this.ssgTestMessage = 'ssg works';
  }
}
