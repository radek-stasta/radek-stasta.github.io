import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesDropdownComponent } from './articles-dropdown.component';

describe('MenuDropdownComponent', () => {
  let component: ArticlesDropdownComponent;
  let fixture: ComponentFixture<ArticlesDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
