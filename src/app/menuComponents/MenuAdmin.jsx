"use client";
import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast, Toaster } from "react-hot-toast";

const API_URL = "https://bar-bhangra-backend.vercel.app/api";

export default function MenuAdmin() {
  const [menuTypes, setMenuTypes] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isManageTypesOpen, setIsManageTypesOpen] = useState(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeLabel, setNewTypeLabel] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingType, setEditingType] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editTypeName, setEditTypeName] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const itemsPerPage = 6;

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    categoryId: "",
  });
  const [editMode, setEditMode] = useState(false);

  // Fetch menu types with categories and items
  const fetchMenuData = async () => {
    try {
      setIsPageLoading(true);
      const response = await fetch(`${API_URL}/v1/menu-types`);
      const result = await response.json();

      if (result.success) {
        setMenuTypes(result.data);
        if (result.data.length > 0 && !activeTab) {
          setActiveTab(result.data[0].id);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to load menu data");
      console.error(error);
    } finally {
      setIsPageLoading(false);
    }
  };

  // Fetch items for active menu type
  const fetchItems = async () => {
    if (!activeTab) return;

    try {
      setIsLoading(true);
      const url = new URL(`${API_URL}/v1/menu-items`);
      url.searchParams.append("menuTypeId", activeTab);
      if (searchQuery) url.searchParams.append("search", searchQuery);

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setItems(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to load items");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  useEffect(() => {
    if (activeTab) {
      const currentType = menuTypes.find((t) => t.id === activeTab);
      setCategories(currentType?.categories || []);
      fetchItems();
    }
  }, [activeTab, menuTypes]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (activeTab) fetchItems();
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Filter and paginate items
  const filteredItems = items;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      price: "",
      categoryId: "",
    });
    setImageFile(null);
    setImagePreview("");
    setEditMode(false);
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId,
      });
      setImagePreview(item.imageUrl);
      setEditMode(true);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Menu Type Management
  const handleAddType = async () => {
    if (!newTypeName.trim() || !newTypeLabel.trim()) {
      toast.error("Please enter both name and label");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/v1/menu-types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTypeName, label: newTypeLabel }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Menu type added successfully!");
        setNewTypeName("");
        setNewTypeLabel("");
        setIsTypeModalOpen(false);
        fetchMenuData();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to add menu type");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditType = async (id) => {
    if (!editTypeName.trim()) {
      toast.error("Please enter a name");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/v1/menu-types/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editTypeName, label: editTypeName }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Type updated successfully!");
        setEditingType(null);
        fetchMenuData();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update type");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteType = async (id) => {
    if (!confirm("Are you sure you want to delete this menu type?")) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/v1/menu-types/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Type deleted successfully!");
        fetchMenuData();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete type");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Category Management
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/v1/menu-categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName, menuTypeId: activeTab }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Category added successfully!");
        setNewCategoryName("");
        setIsCategoryModalOpen(false);
        fetchMenuData();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to add category");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = async (id) => {
    if (!editCategoryName.trim()) {
      toast.error("Please enter a name");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/v1/menu-categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editCategoryName }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Category updated successfully!");
        setEditingCategory(null);
        fetchMenuData();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update category");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/v1/menu-categories/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Category deleted successfully!");
        fetchMenuData();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Item Management
  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.categoryId
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!editMode && !imageFile) {
      toast.error("Please upload an image");
      return;
    }

    try {
      setIsLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("categoryId", formData.categoryId);

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const url = editMode
        ? `${API_URL}/v1/menu-items/${formData.id}`
        : `${API_URL}/v1/menu-items`;

      const response = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          editMode ? "Item updated successfully!" : "Item added successfully!"
        );
        closeModal();
        fetchItems();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to save item");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/v1/menu-items/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Item deleted successfully!");
        fetchItems();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete item");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Menu Management
              </h1>
              <p className="text-gray-600">Manage your restaurant menu items</p>
            </div>
            <Button onClick={fetchMenuData} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Management Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => setIsTypeModalOpen(true)}
              variant="outline"
              size="sm"
            >
              <Plus className="mr-2" size={16} />
              Add Menu Type
            </Button>
            <Button
              onClick={() => setIsManageTypesOpen(true)}
              variant="outline"
              size="sm"
            >
              <Pencil className="mr-2" size={16} />
              Manage Types
            </Button>
            <Button
              onClick={() => setIsCategoryModalOpen(true)}
              variant="outline"
              size="sm"
              disabled={!activeTab}
            >
              <Plus className="mr-2" size={16} />
              Add Category
            </Button>
            <Button
              onClick={() => setIsManageCategoriesOpen(true)}
              variant="outline"
              size="sm"
              disabled={!activeTab}
            >
              <Pencil className="mr-2" size={16} />
              Manage Categories
            </Button>
          </div>
        </div>

        {/* Tabs */}
        {menuTypes.length > 0 && (
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              setCurrentPage(1);
            }}
            className="mb-6"
          >
            <TabsList className="bg-white shadow-sm">
              {menuTypes.map((type) => (
                <TabsTrigger key={type.id} value={type.id}>
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {/* Search & Add Button */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px] relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => openModal()}
              disabled={categories.length === 0}
            >
              <Plus className="mr-2" size={20} />
              Add Item
            </Button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                No categories available. Please add a category first.
              </p>
              <Button onClick={() => setIsCategoryModalOpen(true)}>
                <Plus className="mr-2" size={18} />
                Add Category
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-gray-900" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No items found</p>
              <Button onClick={() => openModal()}>
                <Plus className="mr-2" size={18} />
                Add First Item
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {paginatedItems.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <Badge variant="secondary">{item.category.name}</Badge>
                      </div>
                      <h3 className="text-lg font-bold mb-1 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          {item.price}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => openModal(item)}
                            size="icon"
                            variant="outline"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            onClick={() => handleDeleteItem(item.id)}
                            size="icon"
                            variant="destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 border-t">
                  <Button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="icon"
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  <span className="px-4 py-2 text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="icon"
                  >
                    <ChevronRight size={20} />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Add Type Modal */}
        <Dialog open={isTypeModalOpen} onOpenChange={setIsTypeModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Menu Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Type Name (lowercase, e.g., drinks, food)</Label>
                <Input
                  type="text"
                  placeholder="e.g., drinks"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                />
              </div>
              <div>
                <Label>Display Label</Label>
                <Input
                  type="text"
                  placeholder="e.g., Drinks"
                  value={newTypeLabel}
                  onChange={(e) => setNewTypeLabel(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setIsTypeModalOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddType}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Add Type"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Manage Types Modal */}
        <Dialog open={isManageTypesOpen} onOpenChange={setIsManageTypesOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Menu Types</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4 max-h-[400px] overflow-y-auto">
              {menuTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center gap-2 p-3 border rounded-lg"
                >
                  {editingType === type.id ? (
                    <>
                      <Input
                        value={editTypeName}
                        onChange={(e) => setEditTypeName(e.target.value)}
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleEditType(type.id)}
                        disabled={isLoading}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingType(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 font-medium">{type.label}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setEditingType(type.id);
                          setEditTypeName(type.name);
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDeleteType(type.id)}
                        disabled={isLoading}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Category Modal */}
        <Dialog
          open={isCategoryModalOpen}
          onOpenChange={setIsCategoryModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Category Name</Label>
                <Input
                  type="text"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setIsCategoryModalOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCategory}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Add Category"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Manage Categories Modal */}
        <Dialog
          open={isManageCategoriesOpen}
          onOpenChange={setIsManageCategoriesOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Categories</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4 max-h-[400px] overflow-y-auto">
              {categories.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No categories yet
                </p>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-2 p-3 border rounded-lg"
                  >
                    {editingCategory === cat.id ? (
                      <>
                        <Input
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="flex-1"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleEditCategory(cat.id)}
                          disabled={isLoading}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCategory(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 font-medium">{cat.name}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setEditingCategory(cat.id);
                            setEditCategoryName(cat.name);
                          }}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDeleteCategory(cat.id)}
                          disabled={isLoading}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Item Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editMode ? "Edit Item" : "Add New Item"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Image</Label>
                <div className="mt-2">
                  <label className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                      <Upload size={24} />
                      <span>Click to upload image</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Max size: 5MB</p>
                </div>

                {imagePreview && (
                  <div className="mt-4 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      onClick={() => {
                        setImagePreview("");
                        setImageFile(null);
                      }}
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Label>Name</Label>
                <Input
                  type="text"
                  placeholder="Item name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Item description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div>
                <Label>Price</Label>
                <Input
                  type="text"
                  placeholder="e.g., 7€ / 10cl"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Saving..." : editMode ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </div>
  );
}
