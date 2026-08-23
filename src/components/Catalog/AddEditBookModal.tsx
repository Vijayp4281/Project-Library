import React, { useState, useEffect } from 'react';
import { Book } from '../../types';
import { useLibrary } from '../../context/LibraryContext';
import { CATEGORIES, DEPARTMENTS } from '../../data/mockData';
import { X, Plus, Save, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddEditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookToEdit?: Book | null;
}

export const AddEditBookModal: React.FC<AddEditBookModalProps> = ({ isOpen, onClose, bookToEdit }) => {
  const { addBook, updateBook, addToast } = useLibrary();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    edition: '1st Edition',
    category: CATEGORIES[1],
    department: DEPARTMENTS[1],
    totalCopies: 10,
    availableCopies: 10,
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600',
    shelfLocation: 'Shelf CS-01-A',
    publishedYear: 2024
  });

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title,
        author: bookToEdit.author,
        isbn: bookToEdit.isbn,
        publisher: bookToEdit.publisher,
        edition: bookToEdit.edition,
        category: bookToEdit.category,
        department: bookToEdit.department,
        totalCopies: bookToEdit.totalCopies,
        availableCopies: bookToEdit.availableCopies,
        description: bookToEdit.description,
        coverImage: bookToEdit.coverImage,
        shelfLocation: bookToEdit.shelfLocation,
        publishedYear: bookToEdit.publishedYear
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '978-0' + Math.floor(100000000 + Math.random() * 900000000),
        publisher: 'Academic Press',
        edition: '1st Edition',
        category: CATEGORIES[1],
        department: DEPARTMENTS[1],
        totalCopies: 10,
        availableCopies: 10,
        description: '',
        coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600',
        shelfLocation: 'Shelf CS-05-A',
        publishedYear: 2024
      });
    }
  }, [bookToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) {
      addToast('Validation Error', 'Book title and author are required.', 'error');
      return;
    }

    if (bookToEdit) {
      updateBook(bookToEdit.id, formData);
    } else {
      addBook(formData);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        key="add-edit-book-backdrop"
        id="add-edit-book-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          key="add-edit-book-modal-container"
          id="add-edit-book-modal"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          onClick={e => e.stopPropagation()}
          className="bg-slate-900/90 border border-white/15 rounded-3xl shadow-2xl backdrop-blur-2xl max-w-2xl w-full overflow-hidden my-8 text-white"
        >
          {/* Header */}
          <div className="p-6 bg-slate-950/80 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 border border-indigo-400/30">
                {bookToEdit ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {bookToEdit ? `Edit Book (${bookToEdit.id})` : 'Add New Book to Inventory'}
                </h3>
                <p className="text-xs text-slate-400">
                  Fill in book metadata for library cataloging and stock tracking
                </p>
              </div>
            </div>

            <button
              id="close-add-edit-modal"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Book Title *
                </label>
                <input
                  id="form-book-title"
                  type="text"
                  required
                  placeholder="e.g. Modern Software Engineering Architecture"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Author(s) *
                </label>
                <input
                  id="form-book-author"
                  type="text"
                  required
                  placeholder="e.g. Martin Fowler"
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ISBN Number
                </label>
                <input
                  id="form-book-isbn"
                  type="text"
                  placeholder="978-0132350884"
                  value={formData.isbn}
                  onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category
                </label>
                <select
                  id="form-book-category"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:border-indigo-400 transition-all backdrop-blur-md cursor-pointer"
                >
                  {CATEGORIES.filter(c => c !== 'All Categories').map((c, idx) => (
                    <option key={`edit-book-cat-${c}-${idx}`} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Department
                </label>
                <select
                  id="form-book-department"
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:border-indigo-400 transition-all backdrop-blur-md cursor-pointer"
                >
                  {DEPARTMENTS.filter(d => d !== 'All Departments').map((d, idx) => (
                    <option key={`edit-book-dept-${d}-${idx}`} value={d} className="bg-slate-900 text-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Publisher
                </label>
                <input
                  id="form-book-publisher"
                  type="text"
                  placeholder="O'Reilly Media"
                  value={formData.publisher}
                  onChange={e => setFormData({ ...formData, publisher: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl outline-none focus:border-indigo-400 transition-all backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Edition
                </label>
                <input
                  id="form-book-edition"
                  type="text"
                  placeholder="3rd Edition"
                  value={formData.edition}
                  onChange={e => setFormData({ ...formData, edition: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl outline-none focus:border-indigo-400 transition-all backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Total Copies
                </label>
                <input
                  id="form-book-total-copies"
                  type="number"
                  min="1"
                  value={formData.totalCopies}
                  onChange={e => {
                    const total = parseInt(e.target.value) || 1;
                    setFormData({
                      ...formData,
                      totalCopies: total,
                      availableCopies: Math.min(formData.availableCopies, total)
                    });
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:border-indigo-400 transition-all backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Available Copies
                </label>
                <input
                  id="form-book-available-copies"
                  type="number"
                  min="0"
                  max={formData.totalCopies}
                  value={formData.availableCopies}
                  onChange={e => setFormData({ ...formData, availableCopies: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 text-sm bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:border-indigo-400 transition-all backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Shelf Location
                </label>
                <input
                  id="form-book-shelf"
                  type="text"
                  placeholder="Shelf CS-02-A"
                  value={formData.shelfLocation}
                  onChange={e => setFormData({ ...formData, shelfLocation: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl outline-none focus:border-indigo-400 transition-all backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Published Year
                </label>
                <input
                  id="form-book-year"
                  type="number"
                  placeholder="2023"
                  value={formData.publishedYear}
                  onChange={e => setFormData({ ...formData, publishedYear: parseInt(e.target.value) || 2024 })}
                  className="w-full px-3.5 py-2 text-sm bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl outline-none focus:border-indigo-400 transition-all backdrop-blur-md"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cover Image URL
                </label>
                <input
                  id="form-book-cover"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.coverImage}
                  onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl outline-none focus:border-indigo-400 transition-all backdrop-blur-md"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Synopsis / Description
                </label>
                <textarea
                  id="form-book-description"
                  rows={3}
                  placeholder="Detailed summary of book contents..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl outline-none focus:border-indigo-400 transition-all backdrop-blur-md"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors backdrop-blur-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-6 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {bookToEdit ? 'Save Changes' : 'Publish to Catalog'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
