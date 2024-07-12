import { TestBed } from '@angular/core/testing';

import { OrgToHtmlConverterService } from './org-to-html-converter.service';

describe('OrgToHtmlConverterService', () => {
  let service: OrgToHtmlConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrgToHtmlConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
