import { TestBed } from '@angular/core/testing';

import { ActivateAdministradorGuard } from './activate-administrador.guard';

describe('ActivateAdministradorGuard', () => {
  let guard: ActivateAdministradorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ActivateAdministradorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
