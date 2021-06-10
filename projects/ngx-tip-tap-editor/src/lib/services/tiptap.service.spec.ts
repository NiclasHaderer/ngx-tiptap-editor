import { TestBed } from '@angular/core/testing';

import { TiptapService } from './tiptap.service';

describe('TiptapService', () => {
  let service: TiptapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiptapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
