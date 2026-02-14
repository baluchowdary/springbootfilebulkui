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
  totalElements = signal(0);

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
        this.totalElements.set(res.totalElements);
      },
      error: () => {
        this.isLoading.set(false);
        this.products.set([]); // Clear products on error
        alert('Failed to load data. Please try again.');
      }
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
  onFileUpload(fileInput: HTMLInputElement) {
    const file = this.selectedFile();
    if (!file) return;

    this.isUploading.set(true);
    const formData = new FormData();
    formData.append('file', file);
    this.productService.uploadProducts(formData).subscribe({
      next: () => {
        console.log('File uploaded successfully');
        fileInput.value = ''; // Clear the file input after upload
        this.isUploading.set(false); 
        this.selectedFile.set(null);
        console.log('Resetting current page to 0 after upload');
        this.currentPage.set(0); // Reset to first page after upload  
        setTimeout(() => {
           this.loadData();
           this.isLoading.set(false); // Ensure loading state is reset after data is fetched
        }, 100); // Delay to ensure backend has processed the upload before fetching new data


        // this.loadData(); // refresh table after upload
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.isUploading.set(false);
        alert('File upload failed. Please try again.');
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

  onClearDatabase() {
    if (confirm('Are you sure you want to clear the database? This action cannot be undone.')) {
      this.productService.onClearDatabase().subscribe({
        next: (response: any) => {
          alert('Database cleared successfully!');
          console.log('Database cleared', response);
          this.currentPage.set(0); // Reset to first page after clearing
          this.pageSize.set(5); // Optionally reset page size to default
          this.totalPages.set(0); // Reset total pages since data is cleared
          this.products.set([]); // Clear products list immediately
          this.isLoading.set(false); // Ensure loading state is reset
          this.selectedFile.set(null); // Clear any selected file
          this.isUploading.set(false); // Reset uploading state
          this.isLoading.set(false); // Ensure loading state is reset
          this.isUploading.set(false); // Reset uploading state
          this.loadData(); // Refresh data after clearing
        },
        error: (err) => {
          console.error('Failed to clear database', err);
          alert('Failed to clear database. Please try again.');
        }
      });
    }
  }

}