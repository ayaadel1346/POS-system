import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAddProductComponent } from './dashboard-add-product.component';

describe('DashboardAddProductComponent', () => {
  let component: DashboardAddProductComponent;
  let fixture: ComponentFixture<DashboardAddProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAddProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardAddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
