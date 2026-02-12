import { Component, OnInit, Inject, signal } from '@angular/core';
import { ProductService } from '../../services/ProductService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard-component.html',
  styleUrls: ['./dashboard-component.css'],
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {

  // Using Signals for predictable state updates
  products = signal<any[]>([]);
  currentPage = signal(0);
  pageSize = signal(5);
  totalPages = signal(0);
  isLoading = signal(false);

  //upload file feature
  selectedFile = signal<File | null>(null);
  isUploading = signal(false);

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadData();
  }

  // Updated loadData to use currentPage and pageSize signals
  loadData() {
    this.isLoading.set(true);
    // Ensure your service accepts both parameters: (page, size)
    this.productService.getProducts(this.currentPage(), this.pageSize()).subscribe({
      next: (res) => {
        this.products.set(res.content);
        this.totalPages.set(res.totalPages);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

// Pagination Controls
  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(p => p + 1);
      this.loadData();
    }
  }
// Pagination Controls
  prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.loadData();
    }
  }

  // Added missing method if you are calling it from the 'Upload' button
  onFileUpload(event: any) {
    const file = this.selectedFile();
    if (!file) return;

    this.isUploading.set(true);
    const formData = new FormData();
    formData.append('file', file);
    this.productService.uploadProducts(formData).subscribe({
      next: () => {
        this.isUploading.set(false); 
        this.selectedFile.set(null);
        this.loadData(); // refresh table after upload
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.isUploading.set(false);
      }
    });
  }

  // Handle page size change from dropdown
  onPageSizeChange(event: Event) {
    const newSize = Number((event.target as HTMLSelectElement).value);

    // 1. Update size
    this.pageSize.set(newSize);

    // 2. IMPORTANT: Reset to first page to prevent out-of-bounds errors
    this.currentPage.set(0);

    // 3. Fetch new data
    this.loadData();
  }
// Handle file selection from input
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
    }
  }

}