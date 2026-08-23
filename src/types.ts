export type Role = 'guest' | 'student' | 'librarian' | 'staff' | 'admin';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  edition: string;
  category: string;
  department: string;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverImage: string;
  shelfLocation: string;
  publishedYear: number;
  language?: string;
  featured?: boolean;
}

export interface StudentProfile {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  department: string;
  year: string;
  batch?: string;
  avatar: string;
  photoURL?: string;
  photoUrl?: string;
  phone: string;
  joinedDate: string;
  maxBorrowLimit: number;
  emailVerified?: boolean;
}

export interface StaffProfile {
  id: string;
  staffId: string;
  name: string;
  email: string;
  department: string;
  position: string;
  avatar: string;
  photoURL?: string;
  photoUrl?: string;
  phone?: string;
  joinedDate: string;
  role?: 'librarian' | 'staff' | 'admin';
}

export interface AdminProfile {
  id: string;
  adminId?: string;
  staffId?: string;
  name: string;
  email: string;
  department: string;
  position?: string;
  avatar: string;
  photoURL?: string;
  photoUrl?: string;
  phone?: string;
  joinedDate: string;
  role: 'admin';
}

export type BorrowStatus = 'Not Submitted' | 'Submitted' | 'Overdue';

export interface BorrowRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  studentDepartment: string;
  studentEmail?: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  bookEdition?: string;
  borrowDate: string; // ISO string YYYY-MM-DD
  dueDate: string;   // ISO string YYYY-MM-DD
  returnDate?: string; // ISO string YYYY-MM-DD when submitted
  status: BorrowStatus;
  handledByStaffId?: string;
  remarks?: string;
  fineAmount?: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'due_alert' | 'borrow' | 'return' | 'system';
}

export interface SystemSettings {
  maxLoanDays: number;
  finePerDay: number;
  maxBooksPerStudent: number;
  autoEmailReminders: boolean;
  libraryName: string;
}

export interface FilterOptions {
  searchQuery: string;
  category: string;
  department: string;
  author: string;
  availability: 'all' | 'available' | 'out_of_stock';
  edition: string;
  sortBy: 'title' | 'popular' | 'newest' | 'available';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'SUCCESS' | 'ERROR';
  message: string;
  source: 'DevOps-Pipeline' | 'Auth-Service' | 'Catalog-API' | 'Borrow-Service' | 'Firebase-Auth';
}

