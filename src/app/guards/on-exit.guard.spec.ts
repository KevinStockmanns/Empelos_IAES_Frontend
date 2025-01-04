import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { onExitGuard } from './on-exit.guard';

describe('onExitGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => onExitGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
