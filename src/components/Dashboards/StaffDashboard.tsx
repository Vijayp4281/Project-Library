import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { AddEditBookModal } from '../Catalog/AddEditBookModal';
import { ExportModal } from './ExportModal';
import { BarcodeScannerModal } from '../Scanner/BarcodeScannerModal';
import { StudentCirculationModal } from './StudentCirculationModal';
import { Book, StudentProfile, StaffProfile } from '../../types';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BookPlus,
  RotateCcw,
  FileSpreadsheet,
  BarChart3,
  Bell,
  Settings,
  ShieldCheck,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Edit2,
  Camera,
  Download,
  Mail,
  UserCheck,
  QrCode,
  Sparkles,
  Layers,
  DollarSign,
  Calendar,
  Building2,
  UserPlus,
  PanelLeft,
  PanelTop,
  Library,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Menu,
  X,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const StaffDashboard: React.FC = () => {
  const {
    currentStaff,
    borrowRecords,
    books,
    studentsList,
    staffList,
    systemSettings,
    markAsSubmitted,
    deleteBook,
    issueBookByLibrarian,
    addStudent,
    deleteStudent,
    purgeDuplicateStudents,
    addStaffMember,
    deleteStaffMember,
    updateSystemSettings,
    setIsAuthModalOpen,
    openAuthModal,
    currentRole,
    addToast,
    updateStaffProfile
  } = useLibrary();

  // Active Sidebar Menu Item
  const [sidebarTab, setSidebarTab] = useState<
    | 'dashboard'
    | 'books'
    | 'students'
    | 'issue_book'
    | 'return_book'
    | 'borrow_records'
    | 'reports'
    | 'notifications'
    | 'settings'
  >('dashboard');

  // Sidebar Collapse & Mobile Menu State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals & Forms
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);

  // Issue Book Form State
  const [issueStudentRoll, setIssueStudentRoll] = useState('');
  const [issueBookId, setIssueBookId] = useState('');
  const [issueDueDays, setIssueDueDays] = useState(systemSettings.maxLoanDays || 10);
  const [issueRemarks, setIssueRemarks] = useState('');

  // Dropdown Autocomplete Visibility State
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false);

  // Return Book Search State
  const [returnSearch, setReturnSearch] = useState('');

  // General Searches & Filters
  const [inventorySearch, setInventorySearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [studentDeptFilter, setStudentDeptFilter] = useState<string>('all');
  const [collapsedDepts, setCollapsedDepts] = useState<Record<string, boolean>>({});
  const [borrowRecordSearch, setBorrowRecordSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Not Submitted' | 'Submitted' | 'Overdue'>('all');

  // Selected Student for Issue & Return Details Modal
  const [selectedStudentForCirculation, setSelectedStudentForCirculation] = useState<StudentProfile | null>(null);

  // New Student Form Modal State
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    rollNumber: '',
    name: '',
    email: '',
    department: 'Computer Science & Eng',
    year: '3rd Year',
    batch: '2022-2026 Batch',
    phone: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    joinedDate: new Date().toISOString().split('T')[0],
    maxBorrowLimit: 5
  });

  // Settings Local Form State
  const [settingsForm, setSettingsForm] = useState(systemSettings);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentStaff?.name || '',
    staffId: currentStaff?.staffId || '',
    position: currentStaff?.position || '',
    department: currentStaff?.department || '',
    email: currentStaff?.email || '',
    phone: currentStaff?.phone || '',
    avatar: currentStaff?.avatar || ''
  });

  if (currentRole !== 'staff' && currentRole !== 'librarian') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 backdrop-blur-2xl rounded-3xl p-10 text-center space-y-4 my-8 max-w-xl mx-auto shadow-xl text-slate-900 dark:text-white transition-colors">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Librarian / Staff Portal Access</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Access is restricted to authorized Library Staff and Archivist accounts. Sign in or register a new staff account to manage circulation and library operations.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            id="btn-staff-portal-login"
            onClick={() => openAuthModal('signin', 'staff')}
            className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 border border-blue-500/30 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" /> Sign In as Staff
          </button>
          <button
            id="btn-staff-portal-register"
            onClick={() => openAuthModal('register', 'staff')}
            className="py-2.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-700 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-indigo-500" /> Register Staff Account
          </button>
        </div>
      </div>
    );
  }

  // Auto-fill student info in Issue Book
  const matchedStudent = studentsList.find(
    s => s.rollNumber.toLowerCase().trim() === issueStudentRoll.toLowerCase().trim()
  );

  // Auto-fill book info in Issue Book
  const matchedBook = books.find(
    b => b.id.toLowerCase().trim() === issueBookId.toLowerCase().trim()
  );

  // Analytics Metrics
  const totalBooksCount = (books || []).length;
  const availableBooksCount = (books || []).reduce((acc, b) => acc + (b?.availableCopies || 0), 0);
  const totalCopiesCount = (books || []).reduce((acc, b) => acc + (b?.totalCopies || 0), 0);
  const activeLoansCount = (borrowRecords || []).filter(r => r && r.status === 'Not Submitted').length;
  const overdueLoansCount = (borrowRecords || []).filter(r => r && r.status === 'Overdue').length;
  const returnedCount = (borrowRecords || []).filter(r => r && r.status === 'Submitted').length;
  const totalStudentsCount = (studentsList || []).length;

  // Chart Data Preparation
  const categoryCountMap: Record<string, number> = {};
  (books || []).forEach(b => {
    if (b && b.category) {
      categoryCountMap[b.category] = (categoryCountMap[b.category] || 0) + 1;
    }
  });

  const categoryChartData = Object.keys(categoryCountMap).map(cat => ({
    name: cat,
    value: categoryCountMap[cat]
  }));

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6', '#6366f1'];

  const borrowReturnChartData = [
    { name: 'Active Borrowed', count: activeLoansCount },
    { name: 'Returned Books', count: returnedCount },
    { name: 'Overdue Books', count: overdueLoansCount }
  ];

  const monthlyBorrowData = [
    { month: 'Jan', issued: 12, returned: 10 },
    { month: 'Feb', issued: 19, returned: 15 },
    { month: 'Mar', issued: 25, returned: 22 },
    { month: 'Apr', issued: 18, returned: 17 },
    { month: 'May', issued: 30, returned: 28 },
    { month: 'Jun', issued: 22, returned: 20 },
    { month: 'Jul', issued: 35, returned: 31 },
    { month: 'Aug', issued: activeLoansCount + returnedCount, returned: returnedCount }
  ];

  // Active borrow records for Return Book section
  const activeReturnRecords = borrowRecords.filter(r => {
    const isPending = r.status !== 'Submitted';
    const query = returnSearch.toLowerCase().trim();
    if (!query) return isPending;
    return (
      isPending &&
      (r.studentRollNo.toLowerCase().includes(query) ||
        r.studentName.toLowerCase().includes(query) ||
        r.bookId.toLowerCase().includes(query) ||
        r.bookTitle.toLowerCase().includes(query))
    );
  });

  // Filtered borrow records table
  const filteredBorrowRecords = borrowRecords.filter(r => {
    const query = borrowRecordSearch.toLowerCase().trim();
    const matchesQuery =
      !query ||
      r.studentName.toLowerCase().includes(query) ||
      r.studentRollNo.toLowerCase().includes(query) ||
      r.bookTitle.toLowerCase().includes(query) ||
      r.bookId.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  // Calculate fine for overdue book
  const calculateFine = (dueDateStr: string): number => {
    const due = new Date(dueDateStr);
    const today = new Date();
    if (today <= due) return 0;
    const diffDays = Math.ceil((today.getTime() - due.getTime()) / (1000 * 3600 * 24));
    return diffDays * (systemSettings.finePerDay || 1);
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueStudentRoll.trim() || !issueBookId.trim()) {
      addToast('Missing Input', 'Please provide Student Roll Number and Book ID.', 'warning');
      return;
    }

    const success = issueBookByLibrarian({
      studentRollNo: issueStudentRoll,
      bookId: issueBookId,
      dueDateDays: issueDueDays,
      remarks: issueRemarks
    });

    if (success) {
      setIssueStudentRoll('');
      setIssueBookId('');
      setIssueRemarks('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.rollNumber || !newStudent.name || !newStudent.email) {
      addToast('Input Error', 'Please complete roll number, name, and email.', 'warning');
      return;
    }
    addStudent(newStudent);
    setIsAddStudentOpen(false);
    setNewStudent({
      rollNumber: '',
      name: '',
      email: '',
      department: 'Computer Science & Eng',
      year: '3rd Year',
      batch: '2022-2026 Batch',
      phone: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      joinedDate: new Date().toISOString().split('T')[0],
      maxBorrowLimit: 5
    });
  };

  // Dynamic Department Extraction & Grouping for Students Directory
  const allDepartmentNames = Array.from(
    new Set(
      (studentsList || [])
        .map(s => s?.department?.trim())
        .filter((dept): dept is string => Boolean(dept && dept.trim()))
    )
  ).sort();

  const hasUnassignedDept = (studentsList || []).some(
    s => !s || !s.department || !s.department.trim()
  );

  const filteredStudents = (studentsList || []).filter(s => {
    if (!s) return false;
    const searchLower = (studentSearch || '').trim().toLowerCase();
    const matchesSearch =
      !searchLower ||
      (s.name && s.name.toLowerCase().includes(searchLower)) ||
      (s.rollNumber && s.rollNumber.toLowerCase().includes(searchLower)) ||
      (s.email && s.email.toLowerCase().includes(searchLower)) ||
      (s.department && s.department.toLowerCase().includes(searchLower));

    const studentDept = s.department?.trim() || 'Department Not Assigned';
    const matchesDept =
      studentDeptFilter === 'all' || studentDept === studentDeptFilter;

    return matchesSearch && matchesDept;
  });

  const groupedStudentsByDept = filteredStudents.reduce((acc, student) => {
    if (!student) return acc;
    const deptKey = student.department?.trim() || 'Department Not Assigned';
    if (!acc[deptKey]) {
      acc[deptKey] = [];
    }
    acc[deptKey].push(student);
    return acc;
  }, {} as Record<string, StudentProfile[]>);

  const toggleDeptCollapse = (deptName: string) => {
    setCollapsedDepts(prev => ({
      ...prev,
      [deptName]: !prev[deptName]
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 my-4 min-h-[85vh] relative">
      {/* MOBILE TOP HEADER (Visible on screens < lg) */}
      <header className="lg:hidden bg-[#0B1220] border border-[#24324A] p-3.5 rounded-2xl flex items-center justify-between text-white shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-[#111A2E] text-[#E2E8F0] hover:text-[#14B8A6] border border-[#24324A] cursor-pointer transition-all"
            aria-label="Open Sidebar Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#14B8A6] flex items-center justify-center text-white shadow-md shadow-blue-600/30 shrink-0">
              <Library className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-white">LIBRARY</div>
              <div className="text-[9px] font-bold text-[#14B8A6]">MANAGEMENT SYSTEM</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="p-2 rounded-xl bg-[#111A2E] text-[#14B8A6] hover:bg-[#14B8A6]/20 border border-[#24324A] cursor-pointer transition-all"
            title="Launch Scanner"
          >
            <Camera className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSidebarTab('notifications')}
            className="p-2 rounded-xl bg-[#111A2E] text-[#94A3B8] hover:text-white border border-[#24324A] relative cursor-pointer transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          </button>
          <img
            src={currentStaff?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt="Profile"
            className="w-8 h-8 rounded-xl object-cover border border-[#2563EB]/40 cursor-pointer"
            onClick={() => setSidebarTab('settings')}
          />
        </div>
      </header>

      {/* MOBILE SLIDE-OUT NAVIGATION DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div key="staff-mobile-drawer-wrapper" className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              key="staff-mobile-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Slide Drawer */}
            <motion.aside
              key="staff-mobile-drawer-aside"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-72 max-w-[85vw] bg-[#0B1220] border-r border-[#24324A] text-[#E2E8F0] p-4 flex flex-col justify-between h-full z-10 shadow-2xl overflow-y-auto"
            >
              <div className="space-y-4">
                {/* Header Logo & Close */}
                <div className="flex items-center justify-between pb-3 border-b border-[#24324A]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#14B8A6] flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-600/30">
                      <Library className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-white">LIBRARY</div>
                      <div className="text-[9px] font-bold text-[#14B8A6]">MANAGEMENT SYSTEM</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-xl bg-[#111A2E] text-[#94A3B8] hover:text-white border border-[#24324A] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Dashboard Menu Item */}
                <button
                  onClick={() => {
                    setSidebarTab('dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                    sidebarTab === 'dashboard'
                      ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                      : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
                  }`}
                >
                  <LayoutDashboard className={`w-4 h-4 ${sidebarTab === 'dashboard' ? 'text-white' : 'text-[#94A3B8]'}`} />
                  <span>Dashboard</span>
                </button>

                {/* Group 1: OPERATIONS */}
                <div className="space-y-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]/60 px-3 py-1">
                    OPERATIONS
                  </div>
                  <button
                    onClick={() => {
                      setSidebarTab('issue_book');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      sidebarTab === 'issue_book'
                        ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                        : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <BookPlus className={`w-4 h-4 ${sidebarTab === 'issue_book' ? 'text-white' : 'text-[#14B8A6]'}`} />
                      <span>Issue Book</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/30">
                      New
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setSidebarTab('return_book');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      sidebarTab === 'return_book'
                        ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                        : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RotateCcw className={`w-4 h-4 ${sidebarTab === 'return_book' ? 'text-white' : 'text-[#94A3B8]'}`} />
                      <span>Return Book</span>
                    </div>
                    {activeLoansCount > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {activeLoansCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setSidebarTab('borrow_records');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                      sidebarTab === 'borrow_records'
                        ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                        : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
                    }`}
                  >
                    <FileSpreadsheet className={`w-4 h-4 ${sidebarTab === 'borrow_records' ? 'text-white' : 'text-[#94A3B8]'}`} />
                    <span>Borrow Records</span>
                  </button>
                </div>

                {/* Group 2: LIBRARY */}
                <div className="space-y-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]/60 px-3 py-1">
                    LIBRARY
                  </div>
                  <button
                    onClick={() => {
                      setSidebarTab('books');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      sidebarTab === 'books'
                        ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                        : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className={`w-4 h-4 ${sidebarTab === 'books' ? 'text-white' : 'text-[#94A3B8]'}`} />
                      <span>Books Catalog</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-[#111A2E] text-[#94A3B8] border border-[#24324A]">
                      {books.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setSidebarTab('students');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      sidebarTab === 'students'
                        ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                        : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users className={`w-4 h-4 ${sidebarTab === 'students' ? 'text-white' : 'text-[#94A3B8]'}`} />
                      <span>Students</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-[#111A2E] text-[#94A3B8] border border-[#24324A]">
                      {studentsList.length}
                    </span>
                  </button>
                </div>

                {/* Group 3: INSIGHTS */}
                <div className="space-y-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]/60 px-3 py-1">
                    INSIGHTS
                  </div>
                  <button
                    onClick={() => {
                      setSidebarTab('reports');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                      sidebarTab === 'reports'
                        ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                        : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
                    }`}
                  >
                    <BarChart3 className={`w-4 h-4 ${sidebarTab === 'reports' ? 'text-white' : 'text-[#94A3B8]'}`} />
                    <span>Reports & Export</span>
                  </button>
                </div>

                {/* Group 4: SYSTEM */}
                <div className="space-y-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]/60 px-3 py-1">
                    SYSTEM
                  </div>
                  <button
                    onClick={() => {
                      setSidebarTab('notifications');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      sidebarTab === 'notifications'
                        ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                        : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Bell className={`w-4 h-4 ${sidebarTab === 'notifications' ? 'text-white' : 'text-[#94A3B8]'}`} />
                      <span>Notifications</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  </button>

                  <button
                    onClick={() => {
                      setSidebarTab('settings');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                      sidebarTab === 'settings'
                        ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                        : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
                    }`}
                  >
                    <Settings className={`w-4 h-4 ${sidebarTab === 'settings' ? 'text-white' : 'text-[#94A3B8]'}`} />
                    <span>System Settings</span>
                  </button>
                </div>
              </div>

              {/* Drawer Profile Section */}
              <div className="pt-4 border-t border-[#24324A] space-y-3">
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="w-full py-2 px-3 bg-[#111A2E] hover:bg-[#14B8A6]/20 border border-[#24324A] hover:border-[#14B8A6]/40 text-[#14B8A6] font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Camera className="w-3.5 h-3.5" /> Launch Barcode Scanner
                </button>

                <div
                  onClick={() => {
                    setSidebarTab('settings');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-[#111A2E] border border-[#24324A] cursor-pointer"
                >
                  <img
                    src={currentStaff?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                    alt={currentStaff?.name || 'Staff'}
                    className="w-9 h-9 rounded-xl object-cover border border-[#2563EB]/40 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-[#E2E8F0] truncate">
                      {currentStaff?.name || 'Eswara'}
                    </div>
                    <div className="text-[10px] font-semibold text-[#14B8A6] truncate">
                      {currentStaff?.position || 'Assistant Librarian'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* DESKTOP LEFT SIDEBAR */}
      <aside
        className={`hidden lg:flex flex-col justify-between shrink-0 bg-[#0B1220] border border-[#24324A] text-[#E2E8F0] p-4 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden scrollbar-none ${
          isSidebarCollapsed ? 'w-[72px] px-2.5' : 'w-64'
        }`}
      >
        <div className="space-y-4">
          {/* 1. TOP LOGO SECTION */}
          <div className={`flex items-center gap-3 pb-3 border-b border-[#24324A] ${isSidebarCollapsed ? 'justify-center' : 'px-1'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#14B8A6] flex items-center justify-center text-white font-extrabold shadow-lg shadow-blue-600/30 shrink-0">
              <Library className="w-5 h-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0">
                <div className="text-xs font-black tracking-wider text-white uppercase leading-tight font-sans">
                  LIBRARY
                </div>
                <div className="text-[10px] font-bold text-[#14B8A6] tracking-tight truncate">
                  MANAGEMENT SYSTEM
                </div>
              </div>
            )}
          </div>

          {/* 2. DASHBOARD ITEM */}
          <button
            onClick={() => setSidebarTab('dashboard')}
            title={isSidebarCollapsed ? 'Dashboard' : undefined}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-3 cursor-pointer ${
              sidebarTab === 'dashboard'
                ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
            } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
          >
            <LayoutDashboard className={`w-4 h-4 shrink-0 ${sidebarTab === 'dashboard' ? 'text-white' : 'text-[#94A3B8]'}`} />
            {!isSidebarCollapsed && <span>Dashboard</span>}
          </button>

          {/* 3. NAVIGATION GROUPS */}
          <nav className="space-y-4">
            {/* GROUP 1: OPERATIONS */}
            <div className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]/60 px-3 py-1">
                  OPERATIONS
                </div>
              )}
              <button
                onClick={() => setSidebarTab('issue_book')}
                title={isSidebarCollapsed ? 'Issue Book' : undefined}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  sidebarTab === 'issue_book'
                    ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                    : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
                } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <BookPlus className={`w-4 h-4 shrink-0 ${sidebarTab === 'issue_book' ? 'text-white' : 'text-[#14B8A6]'}`} />
                  {!isSidebarCollapsed && <span>Issue Book</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/30">
                    New
                  </span>
                )}
              </button>

              <button
                onClick={() => setSidebarTab('return_book')}
                title={isSidebarCollapsed ? 'Return Book' : undefined}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  sidebarTab === 'return_book'
                    ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                    : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
                } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <RotateCcw className={`w-4 h-4 shrink-0 ${sidebarTab === 'return_book' ? 'text-white' : 'text-[#94A3B8]'}`} />
                  {!isSidebarCollapsed && <span>Return Book</span>}
                </div>
                {!isSidebarCollapsed && activeLoansCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {activeLoansCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setSidebarTab('borrow_records')}
                title={isSidebarCollapsed ? 'Borrow Records' : undefined}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                  sidebarTab === 'borrow_records'
                    ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                    : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
                } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              >
                <FileSpreadsheet className={`w-4 h-4 shrink-0 ${sidebarTab === 'borrow_records' ? 'text-white' : 'text-[#94A3B8]'}`} />
                {!isSidebarCollapsed && <span>Borrow Records</span>}
              </button>
            </div>

            {/* GROUP 2: LIBRARY */}
            <div className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]/60 px-3 py-1">
                  LIBRARY
                </div>
              )}
              <button
                onClick={() => setSidebarTab('books')}
                title={isSidebarCollapsed ? 'Books Catalog' : undefined}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  sidebarTab === 'books'
                    ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                    : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
                } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className={`w-4 h-4 shrink-0 ${sidebarTab === 'books' ? 'text-white' : 'text-[#94A3B8]'}`} />
                  {!isSidebarCollapsed && <span>Books Catalog</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-[#111A2E] text-[#94A3B8] border border-[#24324A]">
                    {books.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setSidebarTab('students')}
                title={isSidebarCollapsed ? 'Students' : undefined}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  sidebarTab === 'students'
                    ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                    : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
                } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Users className={`w-4 h-4 shrink-0 ${sidebarTab === 'students' ? 'text-white' : 'text-[#94A3B8]'}`} />
                  {!isSidebarCollapsed && <span>Students</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-[#111A2E] text-[#94A3B8] border border-[#24324A]">
                    {studentsList.length}
                  </span>
                )}
              </button>
            </div>

            {/* GROUP 3: INSIGHTS */}
            <div className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]/60 px-3 py-1">
                  INSIGHTS
                </div>
              )}
              <button
                onClick={() => setSidebarTab('reports')}
                title={isSidebarCollapsed ? 'Reports & Export' : undefined}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                  sidebarTab === 'reports'
                    ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                    : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
                } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              >
                <BarChart3 className={`w-4 h-4 shrink-0 ${sidebarTab === 'reports' ? 'text-white' : 'text-[#94A3B8]'}`} />
                {!isSidebarCollapsed && <span>Reports & Export</span>}
              </button>
            </div>

            {/* GROUP 4: SYSTEM */}
            <div className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]/60 px-3 py-1">
                  SYSTEM
                </div>
              )}
              <button
                onClick={() => setSidebarTab('notifications')}
                title={isSidebarCollapsed ? 'Notifications' : undefined}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  sidebarTab === 'notifications'
                    ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                    : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
                } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Bell className={`w-4 h-4 shrink-0 ${sidebarTab === 'notifications' ? 'text-white' : 'text-[#94A3B8]'}`} />
                  {!isSidebarCollapsed && <span>Notifications</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </button>

              <button
                onClick={() => setSidebarTab('settings')}
                title={isSidebarCollapsed ? 'System Settings' : undefined}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                  sidebarTab === 'settings'
                    ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                    : 'text-[#94A3B8] hover:bg-[#111A2E] hover:text-[#E2E8F0]'
                } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              >
                <Settings className={`w-4 h-4 shrink-0 ${sidebarTab === 'settings' ? 'text-white' : 'text-[#94A3B8]'}`} />
                {!isSidebarCollapsed && <span>System Settings</span>}
              </button>
            </div>
          </nav>
        </div>

        {/* BOTTOM CONTAINER */}
        <div className="pt-4 border-t border-[#24324A] space-y-3">
          {/* Quick Scanner Action */}
          {!isSidebarCollapsed && (
            <button
              onClick={() => setIsScannerOpen(true)}
              className="w-full py-2 px-3 bg-[#111A2E] hover:bg-[#14B8A6]/20 border border-[#24324A] hover:border-[#14B8A6]/40 text-[#14B8A6] font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Camera className="w-3.5 h-3.5" /> Barcode Scanner
            </button>
          )}

          {/* PROFILE SECTION */}
          <div
            onClick={() => setSidebarTab('settings')}
            className={`flex items-center gap-3 p-2.5 rounded-xl bg-[#111A2E] border border-[#24324A] hover:border-[#2563EB]/50 transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center p-2' : ''
            }`}
            title="View Profile Settings"
          >
            <img
              src={currentStaff?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={currentStaff?.name || 'Eswara'}
              className="w-9 h-9 rounded-xl object-cover border border-[#2563EB]/40 shrink-0"
            />
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-[#E2E8F0] truncate">
                  {currentStaff?.name || 'Eswara'}
                </div>
                <div className="text-[10px] font-semibold text-[#14B8A6] truncate">
                  {currentStaff?.position || 'Assistant Librarian'}
                </div>
              </div>
            )}
          </div>

          {/* COLLAPSE CONTROL BUTTON */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full py-2 px-3 text-[#94A3B8] hover:text-white hover:bg-[#111A2E] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-[#14B8A6]" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 text-[#14B8A6]" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-1 min-w-0 space-y-6">
        {/* Top Hero Banner (Librarian & Staff Operations Center) */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
            <BookOpen className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/25 border border-blue-400/30 text-blue-200 text-xs font-bold mb-3 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
              Librarian & Staff Operations Center
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Library Circulation & Desk Operations
            </h1>
            <p className="text-sm text-blue-100/80 mt-2 font-medium">
              Full operational desk to issue and return books, manage student circulation, inspect catalog availability, and generate reports.
            </p>
          </div>
        </div>

        {/* 1. DASHBOARD VIEW (CARDS & CHARTS) */}
        {sidebarTab === 'dashboard' && (
          <div className="space-y-6">
            {/* STAT CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Total Books
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalBooksCount}</div>
                <div className="text-[10px] text-slate-400 font-mono">{totalCopiesCount} total copies</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Available
                </div>
                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {availableBooksCount}
                </div>
                <div className="text-[10px] text-slate-400">Ready on shelves</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <BookPlus className="w-3.5 h-3.5 text-blue-500" /> Issued
                </div>
                <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{activeLoansCount}</div>
                <div className="text-[10px] text-slate-400">Currently borrowed</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-indigo-500" /> Returned
                </div>
                <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{returnedCount}</div>
                <div className="text-[10px] text-slate-400">Checked back in</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-500" /> Total Students
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalStudentsCount}</div>
                <div className="text-[10px] text-slate-400">Enrolled patrons</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Overdue Books
                </div>
                <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">{overdueLoansCount}</div>
                <div className="text-[10px] text-slate-400">Action required</div>
              </div>
            </div>

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Borrowed vs Returned vs Overdue */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Borrowed vs Returned Books Status
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Live Circulation</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={borrowReturnChartData}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                      <YAxis stroke="#888888" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Category-wise Books */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Category-wise Books Breakdown
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">{categoryChartData.length} Categories</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}-${entry.name || 'cat'}-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '12px'
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                        formatter={value => <span className="text-slate-700 dark:text-slate-300">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart 3: Monthly Borrow Statistics */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Monthly Borrow & Return Statistics
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Academic Year 2026</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyBorrowData}>
                    <XAxis dataKey="month" stroke="#888888" fontSize={11} />
                    <YAxis stroke="#888888" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '12px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="issued" name="Books Issued" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="returned" name="Books Returned" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* 2. ISSUE BOOK WORKFLOW PAGE */}
        {sidebarTab === 'issue_book' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BookPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Issue Physical Book to Student
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Step 2 Circulation Desk: Verify student credentials, scan or select book ID, and confirm loan record.
                </p>
              </div>
              <button
                onClick={() => setIsScannerOpen(true)}
                className="py-2 px-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <QrCode className="w-4 h-4" /> Scan Barcode
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* STUDENT SECTION */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 1. Student Lookup & Auto-fill
                    </span>
                    {matchedStudent ? (
                      <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Profile Auto-filled
                      </span>
                    ) : issueStudentRoll ? (
                      <span className="text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Auto-Generated Info
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Student Roll Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Type roll number (e.g. 245863, 22IT012, 23AI089)..."
                        value={issueStudentRoll}
                        onFocus={() => setIsStudentDropdownOpen(true)}
                        onChange={e => {
                          setIssueStudentRoll(e.target.value);
                          setIsStudentDropdownOpen(true);
                        }}
                        className="w-full pl-9 pr-8 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-bold text-slate-900 dark:text-white uppercase font-mono transition-all"
                        required
                      />
                      {issueStudentRoll && (
                        <button
                          type="button"
                          onClick={() => {
                            setIssueStudentRoll('');
                            setIsStudentDropdownOpen(false);
                          }}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                        >
                          ✕
                        </button>
                      )}

                      {/* Autocomplete Dropdown */}
                      {isStudentDropdownOpen && (
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsStudentDropdownOpen(false)}
                        />
                      )}
                      <AnimatePresence>
                        {isStudentDropdownOpen && (
                          <motion.div
                            key="student-drop-menu-container"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-20 max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800"
                          >
                              <div className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/60">
                                Select Registered Student
                              </div>
                              {studentsList
                                .filter(s => {
                                  if (!issueStudentRoll.trim()) return true;
                                  const q = issueStudentRoll.toLowerCase().trim();
                                  return (
                                    s.rollNumber.toLowerCase().includes(q) ||
                                    s.name.toLowerCase().includes(q) ||
                                    s.email.toLowerCase().includes(q) ||
                                    s.department.toLowerCase().includes(q)
                                  );
                                })
                                .map((student, idx) => (
                                  <button
                                    key={`student-drop-${student.id || student.rollNumber}-${idx}`}
                                    type="button"
                                    onClick={() => {
                                      setIssueStudentRoll(student.rollNumber);
                                      setIsStudentDropdownOpen(false);
                                      addToast('Student Loaded', `Auto-filled profile for ${student.name}`, 'info');
                                    }}
                                    className="w-full p-2.5 text-left hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-between transition-all cursor-pointer group"
                                  >
                                    <div className="flex items-center gap-2.5 truncate">
                                      <img
                                        src={student.avatar}
                                        alt={student.name}
                                        className="w-7 h-7 rounded-full object-cover border border-emerald-500/30"
                                      />
                                      <div className="truncate">
                                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                          {student.name}
                                        </div>
                                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                          {student.department} • {student.email}
                                        </div>
                                      </div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                                      {student.rollNumber}
                                    </span>
                                  </button>
                                ))}
                            </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Auto-filled Student Details Cards */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-400 text-[10px] font-bold flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-emerald-500" /> Student Name (Auto-filled)
                        </span>
                        {matchedStudent && (
                          <span className="text-[9px] text-emerald-500 font-medium">Synced from Directory</span>
                        )}
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={matchedStudent?.name || (issueStudentRoll ? `Student (${issueStudentRoll})` : '—')}
                        className={`w-full px-3 py-2 bg-slate-100 dark:bg-slate-900/80 border rounded-xl text-slate-800 dark:text-slate-200 font-bold transition-all ${
                          matchedStudent
                            ? 'border-emerald-500/50 ring-2 ring-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400 text-[10px] font-bold block mb-1">
                          Department (Auto-filled)
                        </span>
                        <input
                          type="text"
                          readOnly
                          value={matchedStudent?.department || (issueStudentRoll ? 'Computer Science & Engineering' : '—')}
                          className="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 font-medium text-[11px]"
                        />
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] font-bold block mb-1">
                          Email Address (Auto-filled)
                        </span>
                        <input
                          type="text"
                          readOnly
                          value={
                            matchedStudent?.email ||
                            (issueStudentRoll ? `${issueStudentRoll.toLowerCase().replace(/[^a-z0-9]/g, '')}@sritcbe.ac.in` : '—')
                          }
                          className="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 font-medium text-[11px] truncate"
                        />
                      </div>
                    </div>

                    {/* Rich Student Status Preview Banner */}
                    {matchedStudent ? (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 truncate">
                          <img
                            src={matchedStudent.avatar}
                            alt={matchedStudent.name}
                            className="w-8 h-8 rounded-full object-cover border border-emerald-500/40 shrink-0"
                          />
                          <div className="truncate">
                            <div className="font-extrabold text-xs text-emerald-800 dark:text-emerald-300 truncate">
                              {matchedStudent.name}
                            </div>
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate">
                              {matchedStudent.year} • {matchedStudent.batch}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                            Limit: {matchedStudent.maxBorrowLimit || 5} Books
                          </div>
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            Eligible to Borrow
                          </span>
                        </div>
                      </div>
                    ) : issueStudentRoll ? (
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">
                          Roll number <span className="font-mono font-bold text-slate-900 dark:text-white">{issueStudentRoll}</span> not in database.
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            addStudent({
                              rollNumber: issueStudentRoll,
                              name: `Student (${issueStudentRoll})`,
                              email: `${issueStudentRoll.toLowerCase().replace(/[^a-z0-9]/g, '')}@sritcbe.ac.in`,
                              department: 'Computer Science & Engineering',
                              year: '3rd Year',
                              batch: '2022-2026 Batch',
                              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                              phone: '+1 (555) 019-2834',
                              joinedDate: new Date().toISOString().split('T')[0],
                              maxBorrowLimit: 5
                            });
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <UserPlus className="w-3 h-3" /> Save Record
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* BOOK SECTION */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 2. Book Lookup & Details
                    </span>
                    {matchedBook && (
                      <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Book Found
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Book ID / ISBN <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g., BK-1001, BK-1002..."
                          value={issueBookId}
                          onFocus={() => setIsBookDropdownOpen(true)}
                          onChange={e => {
                            setIssueBookId(e.target.value);
                            setIsBookDropdownOpen(true);
                          }}
                          className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-bold text-slate-900 dark:text-white uppercase font-mono transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setIsScannerOpen(true)}
                          className="p-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl transition-all cursor-pointer text-slate-700 dark:text-slate-200"
                          title="Open Scanner"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Book Autocomplete Dropdown */}
                      {isBookDropdownOpen && (
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsBookDropdownOpen(false)}
                        />
                      )}
                      <AnimatePresence>
                        {isBookDropdownOpen && (
                          <motion.div
                            key="book-drop-menu-container"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-20 max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800"
                          >
                            <div className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/60">
                              Select Library Book
                            </div>
                            {(books || [])
                              .filter(b => {
                                if (!b) return false;
                                if (!issueBookId.trim()) return true;
                                const q = (issueBookId || '').toLowerCase().trim();
                                return (
                                  (b.id && b.id.toLowerCase().includes(q)) ||
                                  (b.title && b.title.toLowerCase().includes(q)) ||
                                  (b.author && b.author.toLowerCase().includes(q)) ||
                                  (b.isbn && b.isbn.toLowerCase().includes(q))
                                );
                              })
                              .map((book, idx) => (
                                <button
                                  key={`book-drop-${book.id || book.isbn || 'bk'}-${idx}`}
                                  type="button"
                                  onClick={() => {
                                    setIssueBookId(book.id || '');
                                    setIsBookDropdownOpen(false);
                                    addToast('Book Loaded', `Selected "${book.title}"`, 'info');
                                  }}
                                  className="w-full p-2.5 text-left hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-between transition-all cursor-pointer group"
                                >
                                  <div className="flex items-center gap-2.5 truncate">
                                    <img
                                      src={book.coverImage}
                                      alt={book.title}
                                      className="w-7 h-9 rounded object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                    />
                                    <div className="truncate">
                                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                                        {book.title}
                                      </div>
                                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                        {book.author} • {book.category}
                                      </div>
                                    </div>
                                  </div>
                                  <span
                                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold shrink-0 ${
                                      book.availableCopies > 0
                                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                                    }`}
                                  >
                                    {book.id} ({book.availableCopies} avail)
                                  </span>
                                </button>
                              ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Auto-filled Book Details */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block mb-1">Book Title (Auto-filled)</span>
                      <input
                        type="text"
                        readOnly
                        value={matchedBook?.title || '—'}
                        className={`w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-900/80 border rounded-lg font-semibold ${
                          matchedBook ? 'border-emerald-500/50 text-slate-900 dark:text-white' : 'border-slate-200 dark:border-slate-800 text-slate-500'
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Author</span>
                        <input
                          type="text"
                          readOnly
                          value={matchedBook?.author || '—'}
                          className="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 font-medium text-[11px] truncate"
                        />
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Edition</span>
                        <input
                          type="text"
                          readOnly
                          value={matchedBook?.edition || '—'}
                          className="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 font-medium text-[11px]"
                        />
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Available Copies</span>
                        <input
                          type="text"
                          readOnly
                          value={matchedBook ? `${matchedBook.availableCopies} / ${matchedBook.totalCopies}` : '—'}
                          className={`w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border rounded-lg font-bold text-[11px] ${
                            matchedBook && matchedBook.availableCopies > 0
                              ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : 'text-rose-600 dark:text-rose-400 border-rose-500/30'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* LOAN DATES & REMARKS */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 3. Circulation Dates & Remarks
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Borrow Date (Auto Today)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-700 dark:text-slate-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Loan Period (Days)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={issueDueDays}
                      onChange={e => setIssueDueDays(parseInt(e.target.value) || 10)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Auto Calculated Due Date
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={
                        new Date(Date.now() + (issueDueDays || 10) * 86400000)
                          .toISOString()
                          .split('T')[0]
                      }
                      className="w-full px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl font-mono text-emerald-600 dark:text-emerald-400 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Staff Remarks / Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Physical copy handed over at Desk 2..."
                    value={issueRemarks}
                    onChange={e => setIssueRemarks(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={matchedBook && matchedBook.availableCopies <= 0}
                  className="py-3 px-8 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/25 border border-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookPlus className="w-4 h-4" /> Issue Book & Sync Firestore
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. RETURN BOOK WORKFLOW PAGE */}
        {sidebarTab === 'return_book' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Return Physical Book Check-in
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Search active student loan, inspect return condition, calculate fine if overdue, and increment inventory.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter student roll or book ID..."
                  value={returnSearch}
                  onChange={e => setReturnSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl outline-none font-medium"
                />
              </div>
            </div>

            {/* Active Borrow Records Table for Returning */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Borrow ID & Student</th>
                    <th className="p-3.5">Book Name & Author</th>
                    <th className="p-3.5">Borrow & Due Dates</th>
                    <th className="p-3.5">Overdue Fine</th>
                    <th className="p-3.5 text-right">Submitted Action (Staff Only)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {activeReturnRecords.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-8 text-slate-500 dark:text-slate-400">
                        No active borrowed books match your search. All physical books returned!
                      </td>
                    </tr>
                  ) : (
                    activeReturnRecords.map((record, idx) => {
                      const fine = calculateFine(record.dueDate);
                      const isOverdue = fine > 0 || record.status === 'Overdue';

                      return (
                        <tr key={`active-ret-${record.id}-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3.5">
                            <span className="inline-block px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              {record.id}
                            </span>
                            <div className="font-bold text-slate-900 dark:text-white">{record.studentName}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              Roll: {record.studentRollNo}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              {record.bookTitle}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                              Author: <span className="font-semibold text-slate-700 dark:text-slate-300">{record.bookAuthor}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Book ID: {record.bookId}
                            </div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap space-y-1">
                            <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              Borrow Date: <span className="font-bold text-slate-800 dark:text-slate-200">{record.borrowDate}</span>
                            </div>
                            <div
                              className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-md inline-flex items-center gap-1 ${
                                isOverdue
                                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              <Clock className="w-3 h-3" />
                              Due Date: {record.dueDate}
                            </div>
                          </td>

                          <td className="p-3.5">
                            {fine > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-extrabold">
                                <DollarSign className="w-3.5 h-3.5" /> ${fine}.00 Fine
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                $0.00 (On Time)
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => markAsSubmitted(record.id)}
                              className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 border border-emerald-500/30 transition-all inline-flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
                              title="Click to mark as Submitted (Staff Only)"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Submitted
                            </button>
                            <span className="block text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                              Staff Access Only
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. BOOKS INVENTORY CATALOG */}
        {sidebarTab === 'books' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Manage Books Catalog ({books.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Add, edit, delete, or search physical library inventory.
                </p>
              </div>

              <button
                onClick={() => {
                  setBookToEdit(null);
                  setIsAddBookModalOpen(true);
                }}
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/25 border border-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New Book
              </button>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Book & ID</th>
                    <th className="p-3.5">Author & Category</th>
                    <th className="p-3.5">Copies Available</th>
                    <th className="p-3.5">Shelf Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {books.map((b, idx) => (
                    <tr key={`staff-inv-book-${b.id}-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={b.coverImage}
                          alt={b.title}
                          className="w-10 h-14 object-cover rounded shadow shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{b.title}</div>
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                            {b.id} • ISBN: {b.isbn}
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{b.author}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{b.category}</div>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            b.availableCopies > 0
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {b.availableCopies} / {b.totalCopies} Available
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {b.shelfLocation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. STUDENTS MANAGEMENT */}
        {sidebarTab === 'students' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Manage Students Directory ({studentsList.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  View student roll numbers, departments, active borrowing limits, and profile records.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  onClick={purgeDuplicateStudents}
                  title="Remove any duplicate student accounts with matching email or roll number"
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" /> Deduplicate Records
                </button>

                <button
                  onClick={() => setIsAddStudentOpen(true)}
                  className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/25 border border-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Add Student Record
                </button>
              </div>
            </div>

            {/* Department Filter & Search Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
                {/* Department Filter Dropdown */}
                <div className="relative w-full sm:w-72">
                  <select
                    value={studentDeptFilter}
                    onChange={e => setStudentDeptFilter(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none focus:border-emerald-500 font-semibold cursor-pointer shadow-sm"
                  >
                    <option value="all">All Departments ({studentsList.length})</option>
                    {allDepartmentNames.map((dept, deptIdx) => {
                      const count = studentsList.filter(s => s.department?.trim() === dept).length;
                      return (
                        <option key={`dept-filter-opt-${dept}-${deptIdx}`} value={dept}>
                          {dept} ({count})
                        </option>
                      );
                    })}
                    {hasUnassignedDept && (
                      <option value="Department Not Assigned">
                        Department Not Assigned ({studentsList.filter(s => !s.department || !s.department.trim()).length})
                      </option>
                    )}
                  </select>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search student name or roll number..."
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl outline-none focus:border-emerald-500 shadow-sm"
                  />
                  {studentSearch && (
                    <button
                      onClick={() => setStudentSearch('')}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {(studentDeptFilter !== 'all' || studentSearch !== '') && (
                <button
                  onClick={() => {
                    setStudentDeptFilter('all');
                    setStudentSearch('');
                  }}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline px-2 py-1 cursor-pointer shrink-0"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Department Sections List */}
            {Object.keys(groupedStudentsByDept).length === 0 ? (
              <div className="py-12 px-4 text-center space-y-3 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <Users className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No students found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {studentDeptFilter !== 'all'
                    ? `No students found in ${studentDeptFilter}.`
                    : 'No student records match your search criteria.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {(Object.entries(groupedStudentsByDept) as [string, StudentProfile[]][]).map(([deptName, studentsInDept], deptIdx) => {
                  const isCollapsed = Boolean(collapsedDepts[deptName]);

                  return (
                    <div
                      key={`dept-card-group-${deptName}-${deptIdx}`}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 overflow-hidden shadow-sm transition-all"
                    >
                      {/* Department Section Header */}
                      <div
                        onClick={() => toggleDeptCollapse(deptName)}
                        className="w-full p-4 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800/90 flex items-center justify-between cursor-pointer border-b border-slate-200/80 dark:border-slate-700/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold border border-emerald-500/20">
                            <GraduationCap className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 flex-wrap">
                              <span>{deptName}</span>
                              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                                ({studentsInDept.length})
                              </span>
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <span className="text-[11px] font-semibold hidden sm:inline">
                            {isCollapsed ? 'Expand' : 'Collapse'}
                          </span>
                          {isCollapsed ? (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-emerald-500" />
                          )}
                        </div>
                      </div>

                      {/* Department Student List / Table */}
                      {!isCollapsed && (
                        <div>
                          {/* Desktop & Tablet Table */}
                          <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-100/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                  <th className="p-3.5 pl-4">Student & Roll No</th>
                                  <th className="p-3.5">Department & Batch</th>
                                  <th className="p-3.5">Contact Email</th>
                                  <th className="p-3.5">Borrow Limit</th>
                                  <th className="p-3.5 pr-4 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-white dark:bg-slate-900/40">
                                {studentsInDept.map((s, idx) => (
                                  <tr
                                    key={`stu-tbl-${deptName}-${s.id || s.rollNumber || 'stu'}-${idx}`}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                  >
                                    <td
                                      onClick={() => setSelectedStudentForCirculation(s)}
                                      className="p-3.5 pl-4 flex items-center gap-3 cursor-pointer group"
                                      title={`Click to view Book Issue & Return History for ${s.name}`}
                                    >
                                      <img
                                        src={
                                          s.avatar ||
                                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                                        }
                                        alt={s.name}
                                        className="w-9 h-9 rounded-full object-cover border border-emerald-500/30 shrink-0 shadow-sm group-hover:scale-105 group-hover:border-emerald-500 transition-all"
                                      />
                                      <div>
                                        <div className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                                          <span>{s.name}</span>
                                          <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                                          Roll: {s.rollNumber}
                                        </div>
                                      </div>
                                    </td>

                                    <td
                                      onClick={() => setSelectedStudentForCirculation(s)}
                                      className="p-3.5 cursor-pointer"
                                    >
                                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                                        {s.department || 'Department Not Assigned'}
                                      </div>
                                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                        {s.year || '3rd Year'} • {s.batch || '2022-2026 Batch'}
                                      </div>
                                    </td>

                                    <td className="p-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                                      {s.email}
                                    </td>

                                    <td className="p-3.5">
                                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] border border-emerald-500/20 inline-block">
                                        Max {s.maxBorrowLimit || 5} Books
                                      </span>
                                    </td>

                                    <td className="p-3.5 pr-4 text-right">
                                      <div className="flex items-center justify-end gap-1.5">
                                        <button
                                          title={`View Book Issue & Return History for ${s.name}`}
                                          onClick={() => setSelectedStudentForCirculation(s)}
                                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-500/20 flex items-center gap-1 cursor-pointer transition-colors"
                                        >
                                          <Eye className="w-3.5 h-3.5" />
                                          <span className="hidden xl:inline">Details & History</span>
                                        </button>
                                        <button
                                          title={`Issue book to ${s.name}`}
                                          onClick={() => {
                                            setIssueStudentRoll(s.rollNumber);
                                            setSidebarTab('issue_book');
                                          }}
                                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20 flex items-center gap-1 cursor-pointer transition-colors"
                                        >
                                          <BookOpen className="w-3.5 h-3.5" />
                                          <span className="hidden xl:inline">Issue</span>
                                        </button>
                                        <button
                                          title={`Delete record for ${s.name} (${s.email})`}
                                          onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete student "${s.name}" (${s.rollNumber}, ${s.email})?`)) {
                                              deleteStudent(s.id);
                                            }
                                          }}
                                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-500/20 flex items-center gap-1 cursor-pointer transition-colors"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                          <span className="hidden xl:inline">Delete</span>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile Cards Layout */}
                          <div className="md:hidden p-3 space-y-3 bg-white dark:bg-slate-900/40">
                            {studentsInDept.map((s, idx) => (
                              <div
                                key={`stu-mob-${deptName}-${s.id || s.rollNumber || 'stu'}-${idx}`}
                                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 space-y-2"
                              >
                                <div
                                  onClick={() => setSelectedStudentForCirculation(s)}
                                  className="flex items-center gap-3 cursor-pointer group"
                                  title={`Click to view Book Issue & Return History for ${s.name}`}
                                >
                                  <img
                                    src={
                                      s.avatar ||
                                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                                    }
                                    alt={s.name}
                                    className="w-10 h-10 rounded-full object-cover border border-emerald-500/30 shrink-0 group-hover:border-emerald-500 transition-colors"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center gap-1.5">
                                      <span>{s.name}</span>
                                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                                      Roll: {s.rollNumber}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/50">
                                  <div>
                                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                                      Dept & Batch:
                                    </span>{' '}
                                    {s.department || 'Not Assigned'} ({s.year || '3rd Year'}, {s.batch || 'Batch'})
                                  </div>
                                  <div className="truncate">
                                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                                      Email:
                                    </span>{' '}
                                    {s.email}
                                  </div>
                                </div>

                                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50">
                                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                                    Max {s.maxBorrowLimit || 5} Books
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setSelectedStudentForCirculation(s)}
                                      className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-semibold border border-blue-500/20 flex items-center gap-1 cursor-pointer"
                                    >
                                      <Eye className="w-3 h-3" /> Details
                                    </button>
                                    <button
                                      onClick={() => {
                                        setIssueStudentRoll(s.rollNumber);
                                        setSidebarTab('issue_book');
                                      }}
                                      className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-500/20 flex items-center gap-1 cursor-pointer"
                                    >
                                      <BookOpen className="w-3 h-3" /> Issue
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`Delete student "${s.name}" (${s.rollNumber}, ${s.email})?`)) {
                                          deleteStudent(s.id);
                                        }
                                      }}
                                      className="px-2 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-semibold border border-rose-500/20 flex items-center gap-1 cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" /> Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 6. BORROW RECORDS & AUDIT HISTORY */}
        {sidebarTab === 'borrow_records' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Borrow Records & Audit History ({borrowRecords.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Complete transactional ledger of issued, returned, and overdue college library books.
                </p>
              </div>

              <button
                onClick={() => setIsExportModalOpen(true)}
                className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Export PDF / CSV
              </button>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student, roll, or book title..."
                  value={borrowRecordSearch}
                  onChange={e => setBorrowRecordSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl outline-none font-semibold cursor-pointer"
              >
                <option value="all">All Statuses ({borrowRecords.length})</option>
                <option value="Not Submitted">Active Loans ({activeLoansCount})</option>
                <option value="Submitted">Returned ({returnedCount})</option>
                <option value="Overdue">Overdue ({overdueLoansCount})</option>
              </select>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Borrow ID & Student</th>
                    <th className="p-3.5">Book Name & Author</th>
                    <th className="p-3.5">Borrow & Due Dates</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Submitted Action (Staff Only)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredBorrowRecords.map((r, idx) => (
                    <tr key={`borrow-rec-${r.id}-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td
                        className="p-3.5 cursor-pointer group"
                        title={`Click to view full circulation profile for ${r.studentName}`}
                        onClick={() => {
                          const foundStudent = studentsList.find(s => 
                            (s.rollNumber && s.rollNumber.toLowerCase() === (r.studentRollNo || '').toLowerCase()) ||
                            (s.name && s.name.toLowerCase() === (r.studentName || '').toLowerCase())
                          ) || {
                            id: r.studentId || r.studentRollNo,
                            rollNumber: r.studentRollNo,
                            name: r.studentName,
                            email: r.studentEmail || `${(r.studentRollNo || 'student').toLowerCase()}@sritcbe.ac.in`,
                            department: r.studentDepartment || 'Engineering',
                            year: '3rd Year',
                            batch: '2022-2026 Batch',
                            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
                            phone: '',
                            joinedDate: r.borrowDate || '2024-01-01',
                            maxBorrowLimit: 5
                          };
                          setSelectedStudentForCirculation(foundStudent);
                        }}
                      >
                        <span className="font-mono font-bold text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {r.id}
                        </span>
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                          <span>{r.studentName}</span>
                          <Eye className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">Roll: {r.studentRollNo}</div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          {r.bookTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Author: {r.bookAuthor}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Book ID: {r.bookId}</div>
                      </td>

                      <td className="p-3.5 font-mono text-[11px] space-y-0.5">
                        <div>Borrow Date: <span className="font-bold text-slate-800 dark:text-slate-200">{r.borrowDate}</span></div>
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">Due Date: {r.dueDate}</div>
                        {r.returnDate && <div className="text-slate-400 text-[10px]">Returned: {r.returnDate}</div>}
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            r.status === 'Submitted'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : r.status === 'Overdue'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {r.status === 'Submitted' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {r.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        {r.status === 'Submitted' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
                          </span>
                        ) : (
                          <button
                            onClick={() => markAsSubmitted(r.id)}
                            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow transition-all inline-flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
                            title="Click to mark as Submitted (Staff Only Access)"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
                          </button>
                        )}
                        <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                          Verified by {r.handledByStaffId || 'STAFF'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. REPORTS & EXPORT */}
        {sidebarTab === 'reports' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Library Reports & Export Center
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Generate formatted PDF reports and CSV data dumps for department audits.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <FileSpreadsheet className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-sm">Borrowing Audit Ledger PDF</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Export complete transaction history including student roll numbers, book IDs, issue dates, and return statuses.
                </p>
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download PDF Report
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <BookOpen className="w-8 h-8 text-blue-500" />
                <h3 className="font-bold text-sm">Catalog Books Inventory Dump</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Export catalog inventory listing total copies, available shelf counts, and category classifications.
                </p>
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Inventory CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 8. NOTIFICATIONS */}
        {sidebarTab === 'notifications' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Notifications & System Reminders
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Automated due-date alerts dispatched to student dashboards.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-amber-600 dark:text-amber-400">
                    Automated Due-Date Reminder Policy Active
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Students with books due within 48 hours receive automatic toast alerts on login.
                  </p>
                </div>
              </div>

              {borrowRecords
                .filter(r => r.status === 'Overdue')
                .map((r, idx) => (
                  <div key={`overdue-alert-${r.id}-${idx}`} className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-rose-600 dark:text-rose-400">Overdue Alert:</span> {r.studentName} ({r.studentRollNo}) - "{r.bookTitle}" (Due: {r.dueDate})
                    </div>
                    <span className="text-[10px] bg-rose-500/20 px-2 py-0.5 rounded text-rose-300 font-mono">Fine: ${calculateFine(r.dueDate)}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 9. SYSTEM SETTINGS */}
        {sidebarTab === 'settings' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Library System Configuration Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Configure default loan durations, daily fine amounts, and maximum student borrowing limits.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Standard Loan Duration (Days)</label>
                <input
                  type="number"
                  value={settingsForm.maxLoanDays}
                  onChange={e => setSettingsForm({ ...settingsForm, maxLoanDays: parseInt(e.target.value) || 10 })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Daily Overdue Fine Amount ($)</label>
                <input
                  type="number"
                  value={settingsForm.finePerDay}
                  onChange={e => setSettingsForm({ ...settingsForm, finePerDay: parseFloat(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Max Books Allowed Per Student</label>
                <input
                  type="number"
                  value={settingsForm.maxBooksPerStudent}
                  onChange={e => setSettingsForm({ ...settingsForm, maxBooksPerStudent: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Library Display Title</label>
                <input
                  type="text"
                  value={settingsForm.libraryName}
                  onChange={e => setSettingsForm({ ...settingsForm, libraryName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => updateSystemSettings(settingsForm)}
                className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Save Settings Configuration
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      <AddEditBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => {
          setIsAddBookModalOpen(false);
          setBookToEdit(null);
        }}
        bookToEdit={bookToEdit}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={code => {
          setIssueBookId(code);
          addToast('Code Scanned', `Scanned Book ID: ${code}`, 'success');
        }}
      />

      {/* Add Student Modal */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-bold text-base">Add New Student Record</h3>
            <form onSubmit={handleCreateStudentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold mb-1">Roll Number</label>
                <input
                  type="text"
                  placeholder="e.g. 12346"
                  value={newStudent.rollNumber}
                  onChange={e => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Student Name"
                  value={newStudent.name}
                  onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1">Email</label>
                <input
                  type="email"
                  placeholder="student@sritcbe.ac.in"
                  value={newStudent.email}
                  onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow"
                >
                  Create Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Student Book Issue & Return Circulation Modal */}
      <StudentCirculationModal
        isOpen={Boolean(selectedStudentForCirculation)}
        onClose={() => setSelectedStudentForCirculation(null)}
        student={selectedStudentForCirculation}
        borrowRecords={borrowRecords}
        onMarkSubmitted={markAsSubmitted}
        onIssueBookForStudent={roll => {
          setIssueStudentRoll(roll);
          setSidebarTab('issue_book');
          addToast('Student Selected', `Ready to issue book to roll number ${roll}`, 'info');
        }}
      />
    </div>
  );
};
