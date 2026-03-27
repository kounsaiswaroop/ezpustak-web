import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LogOut, Plus, Trash2, Edit, Tag, Book, Save, X } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import { useListBooks, useListCategories, useCreateBook, useUpdateBook, useDeleteBook, useCreateCategory, useDeleteCategory, BookCondition } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

// Schemas mapped to backend requirements
const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  originalPrice: z.coerce.number().optional().nullable(),
  condition: z.nativeEnum(BookCondition),
  imageUrl: z.string().optional(),
  categoryId: z.coerce.number().min(1),
  inStock: z.boolean().default(true),
});

type BookFormData = z.infer<typeof bookSchema>;

export default function AdminDashboard() {
  const { isAuthenticated, adminPassword, logout } = useAdmin();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'books' | 'categories'>('books');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !adminPassword) {
      setLocation('/admin/login');
    }
  }, [isAuthenticated, adminPassword, setLocation]);

  // Queries
  const { data: books, isLoading: loadingBooks } = useListBooks();
  const { data: categories, isLoading: loadingCategories } = useListCategories();

  // Mutations
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  // Form
  const bookForm = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: { inStock: true, condition: 'good' }
  });

  const [newCatName, setNewCatName] = useState("");

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  // --- Category Actions ---
  const handleAddCategory = () => {
    if (!newCatName.trim() || !adminPassword) return;
    createCategory.mutate(
      { data: { name: newCatName, adminPassword } },
      {
        onSuccess: () => {
          setNewCatName("");
          queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
          toast({ title: "Category added" });
        },
        onError: (err) => toast({ title: "Error", description: err.error?.error, variant: "destructive" })
      }
    );
  };

  const handleDeleteCategory = (id: number) => {
    if (!confirm("Delete category?")) return;
    deleteCategory.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
          toast({ title: "Category deleted" });
        },
        onError: (err) => toast({ title: "Error", description: err.error?.error, variant: "destructive" })
      }
    );
  };

  // --- Book Actions ---
  const openNewBookModal = () => {
    setEditingBookId(null);
    bookForm.reset({ inStock: true, condition: 'good' });
    setIsBookModalOpen(true);
  };

  const openEditBookModal = (book: any) => {
    setEditingBookId(book.id);
    bookForm.reset({
      ...book,
      originalPrice: book.originalPrice || undefined,
      imageUrl: book.imageUrl || undefined,
      description: book.description || undefined,
    });
    setIsBookModalOpen(true);
  };

  const onBookSubmit = (data: BookFormData) => {
    if (!adminPassword) return;
    
    if (editingBookId) {
      updateBook.mutate(
        { id: editingBookId, data: { ...data, adminPassword } },
        {
          onSuccess: () => {
            setIsBookModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['/api/books'] });
            toast({ title: "Book updated" });
          },
          onError: (err) => toast({ title: "Error", description: err.error?.error, variant: "destructive" })
        }
      );
    } else {
      createBook.mutate(
        { data: { ...data, adminPassword } as any },
        {
          onSuccess: () => {
            setIsBookModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['/api/books'] });
            toast({ title: "Book created" });
          },
          onError: (err) => toast({ title: "Error", description: err.error?.error, variant: "destructive" })
        }
      );
    }
  };

  const handleDeleteBook = (id: number) => {
    if (!confirm("Delete book?")) return;
    deleteBook.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['/api/books'] });
          toast({ title: "Book deleted" });
        },
        onError: (err) => toast({ title: "Error", description: err.error?.error, variant: "destructive" })
      }
    );
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Topbar */}
      <div className="bg-foreground text-background py-4 px-6 flex justify-between items-center sticky top-0 z-40">
        <div className="font-display font-bold text-xl flex items-center gap-2">
          EzPustak <span className="text-primary text-sm font-sans px-2 py-1 bg-primary/20 rounded">Admin Panel</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="flex flex-row md:flex-col gap-2 bg-card p-2 rounded-2xl border border-border shadow-sm">
            <button 
              onClick={() => setActiveTab('books')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'books' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'}`}
            >
              <Book className="w-5 h-5" /> Books Inventory
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'categories' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'}`}
            >
              <Tag className="w-5 h-5" /> Categories
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          
          {/* TAB: BOOKS */}
          {activeTab === 'books' && (
            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10">
                <h2 className="text-xl font-bold">Books ({books?.length || 0})</h2>
                <Button onClick={openNewBookModal}><Plus className="w-4 h-4 mr-2" /> Add Book</Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted text-muted-foreground border-b border-border uppercase tracking-wider text-xs">
                    <tr>
                      <th className="p-4 font-semibold">Details</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold">Price</th>
                      <th className="p-4 font-semibold">Stock</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loadingBooks ? (
                      <tr><td colSpan={5} className="p-8 text-center text-muted-foreground animate-pulse">Loading...</td></tr>
                    ) : books?.map(book => (
                      <tr key={book.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-foreground mb-1 line-clamp-1">{book.title}</div>
                          <div className="text-muted-foreground text-xs">{book.author}</div>
                        </td>
                        <td className="p-4"><span className="bg-secondary px-2 py-1 rounded-md text-xs">{book.categoryName}</span></td>
                        <td className="p-4 font-medium">₹{book.price}</td>
                        <td className="p-4">
                          {book.inStock ? <span className="text-emerald-600 font-bold">Yes</span> : <span className="text-destructive font-bold">No</span>}
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => openEditBookModal(book)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2 transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteBook(book.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10">
                <h2 className="text-xl font-bold">Categories ({categories?.length || 0})</h2>
              </div>
              
              <div className="p-6 border-b border-border bg-background flex gap-4">
                <Input 
                  placeholder="New Category Name" 
                  value={newCatName} 
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="max-w-xs"
                />
                <Button onClick={handleAddCategory} isLoading={createCategory.isPending}>Add</Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted text-muted-foreground border-b border-border uppercase tracking-wider text-xs">
                    <tr>
                      <th className="p-4 font-semibold">ID</th>
                      <th className="p-4 font-semibold w-full">Name</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loadingCategories ? (
                      <tr><td colSpan={3} className="p-8 text-center text-muted-foreground animate-pulse">Loading...</td></tr>
                    ) : categories?.map(cat => (
                      <tr key={cat.id} className="hover:bg-muted/50">
                        <td className="p-4 text-muted-foreground">#{cat.id}</td>
                        <td className="p-4 font-medium">{cat.name}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Book Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-lg">{editingBookId ? 'Edit Book' : 'Add New Book'}</h3>
              <button onClick={() => setIsBookModalOpen(false)} className="p-2 hover:bg-muted rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="book-form" onSubmit={bookForm.handleSubmit(onBookSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Title *</label>
                  <Input {...bookForm.register("title")} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Author *</label>
                  <Input {...bookForm.register("author")} />
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Description</label>
                  <textarea 
                    {...bookForm.register("description")} 
                    className="w-full min-h-24 p-3 rounded-xl border-2 border-border bg-background focus:border-primary outline-none text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Category *</label>
                  <select 
                    {...bookForm.register("categoryId")} 
                    className="w-full h-12 px-4 rounded-xl border-2 border-border bg-background focus:border-primary outline-none text-sm appearance-none"
                  >
                    <option value="">Select Category</option>
                    {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Condition *</label>
                  <select 
                    {...bookForm.register("condition")} 
                    className="w-full h-12 px-4 rounded-xl border-2 border-border bg-background focus:border-primary outline-none text-sm appearance-none"
                  >
                    <option value="like_new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Selling Price (₹) *</label>
                  <Input type="number" {...bookForm.register("price")} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Original Price (₹)</label>
                  <Input type="number" {...bookForm.register("originalPrice")} />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Image URL</label>
                  <Input {...bookForm.register("imageUrl")} placeholder="https://..." />
                </div>

                <div className="space-y-1 md:col-span-2 flex items-center gap-3 bg-muted/50 p-4 rounded-xl mt-2">
                  <input type="checkbox" id="inStock" {...bookForm.register("inStock")} className="w-5 h-5 accent-primary" />
                  <label htmlFor="inStock" className="font-medium cursor-pointer">Available in Stock</label>
                </div>
              </form>
            </div>
            
            <div className="p-5 border-t border-border bg-muted/20 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsBookModalOpen(false)}>Cancel</Button>
              <Button form="book-form" type="submit" isLoading={createBook.isPending || updateBook.isPending}>
                <Save className="w-4 h-4 mr-2" /> Save Book
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
