import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Presentation } from '../interfaces/presentation.interface';
import { PresentationsService } from '../services/presentations.service';
import { PresentationsApiService } from '../services/presentations-api.service';

@Component({
  selector: 'app-presentations',
  templateUrl: './presentations.component.html',
  styleUrls: ['./presentations.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class PresentationsComponent {
  private fb = inject(FormBuilder);
  displayedColumns: string[] = [
    'id',
    'name',
    'product_id',
    'factor',
    'barcode',
    'cost_price',
    'sale_price',
    'default_purchase',
    'default_sale',
    'actions',
  ];

  presentations: Presentation[] = [];
  filteredPresentations: Presentation[] = [];
  isLoading = false;
  error: string | null = null;

  // Form for create/edit
  presentationForm = this.fb.group({
    id: [null],
    name: ['', [Validators.required]],
    product_id: [null, [Validators.required]],
    factor: [1, [Validators.required]],
    barcode: [''],
    cost_price: [0, [Validators.required]],
    sale_price: [0, [Validators.required]],
    default_purchase: [false],
    default_sale: [false],
    enterprise_id: [null, [Validators.required]],
  });

  constructor(private presentationsService: PresentationsApiService) {}

  ngOnInit() {
    this.loadPresentations();
  }

  loadPresentations() {
    this.isLoading = true;
    this.error = null;
    this.presentationsService.getAll().subscribe({
      next: (response) => {
        if (!response.error && response.data) {
          this.presentations = response.data;
          this.filteredPresentations = [...this.presentations];
        } else {
          this.error = response.msg || 'Error loading presentations';
        }
      },
      error: (error) => {
        this.error = 'Failed to load presentations';
        console.error(error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onSubmit() {
    if (this.presentationForm.valid) {
      const formValue = this.presentationForm.value;
      // Handle submit logic
      console.log('Form submitted:', formValue);
    }
  }

  onDelete(id: number) {
    this.presentationsService.delete(id).subscribe({
      next: (response) => {
        if (!response.error && response.msg) {
          this.loadPresentations();
        } else {
          this.error = response.msg || 'Error deleting presentation';
        }
      },
      error: (error) => {
        this.error = 'Failed to delete presentation';
        console.error(error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onReset() {
    this.presentationForm.reset();
    this.presentationForm.patchValue({
      default_purchase: false,
      default_sale: false,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredPresentations = this.presentations.filter((presentation) =>
      presentation.name.toLowerCase().includes(filterValue.toLowerCase()),
    );
  }
}
