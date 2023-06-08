import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAltaEspecialistaComponent } from './form-alta-especialista.component';

describe('FormAltaEspecialistaComponent', () => {
  let component: FormAltaEspecialistaComponent;
  let fixture: ComponentFixture<FormAltaEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAltaEspecialistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAltaEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
