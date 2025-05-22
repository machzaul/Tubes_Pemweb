
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { formatCurrency } from '../../lib/utils';
import { Plus, Pencil, Trash, Image } from 'lucide-react';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct, isAdmin } = useAdmin();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  const defaultProductForm = {
    name: '',
    price: '',
    stock: '',
    image: '',
    description: ''
  };
  
  const [productForm, setProductForm] = useState(defaultProductForm);
  
  useEffect(() => {
    // If not logged in as admin, redirect to admin login page
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is being edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!productForm.name.trim()) errors.name = 'Product name is required';
    
    if (!productForm.price.trim()) {
      errors.price = 'Price is required';
    } else if (isNaN(parseFloat(productForm.price)) || parseFloat(productForm.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    
    if (!productForm.stock.trim()) {
      errors.stock = 'Stock quantity is required';
    } else if (isNaN(parseInt(productForm.stock)) || parseInt(productForm.stock) < 0) {
      errors.stock = 'Stock must be a non-negative number';
    }
    
    if (!productForm.image.trim()) errors.image = 'Image URL is required';
    if (!productForm.description.trim()) errors.description = 'Product description is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleAddProduct = () => {
    if (!validateForm()) return;
    
    const newProduct = {
      name: productForm.name,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
      image: productForm.image,
      description: productForm.description
    };
    
    addProduct(newProduct);
    
    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added successfully.`,
    });
    
    setProductForm(defaultProductForm);
    setIsAddDialogOpen(false);
  };
  
  const handleEditProduct = () => {
    if (!validateForm()) return;
    
    const updatedProduct = {
      id: currentProduct.id,
      name: productForm.name,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
      image: productForm.image,
      description: productForm.description
    };
    
    updateProduct(updatedProduct);
    
    toast({
      title: "Product Updated",
      description: `${updatedProduct.name} has been updated successfully.`,
    });
    
    setCurrentProduct(null);
    setProductForm(defaultProductForm);
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteProduct = () => {
    deleteProduct(currentProduct.id);
    
    toast({
      title: "Product Deleted",
      description: `${currentProduct.name} has been deleted.`,
    });
    
    setCurrentProduct(null);
    setIsDeleteDialogOpen(false);
  };
  
  const openEditDialog = (product) => {
    setCurrentProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image,
      description: product.description
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="section-title mb-0">Manage Products</h1>
        <Button onClick={() => {
          setProductForm(defaultProductForm);
          setFormErrors({});
          setIsAddDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>
      
      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Image className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-xl font-medium text-gray-900">No products found</h2>
          <p className="mt-2 text-gray-500">Get started by creating a new product.</p>
          <Button className="mt-6" onClick={() => {
            setProductForm(defaultProductForm);
            setFormErrors({});
            setIsAddDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Product
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-12 w-12 rounded-md object-cover mr-4"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      product.stock > 10 
                        ? 'bg-green-100 text-green-800' 
                        : product.stock > 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? product.stock : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-700 border-red-200 hover:bg-red-50"
                        onClick={() => openDeleteDialog(product)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  name="name"
                  value={productForm.name}
                  onChange={handleChange}
                  className={formErrors.name ? 'border-red-500' : ''}
                />
                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price *
              </Label>
              <div className="col-span-3">
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={productForm.price}
                  onChange={handleChange}
                  className={formErrors.price ? 'border-red-500' : ''}
                />
                {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock *
              </Label>
              <div className="col-span-3">
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={productForm.stock}
                  onChange={handleChange}
                  className={formErrors.stock ? 'border-red-500' : ''}
                />
                {formErrors.stock && <p className="text-red-500 text-sm mt-1">{formErrors.stock}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL *
              </Label>
              <div className="col-span-3">
                <Input
                  id="image"
                  name="image"
                  value={productForm.image}
                  onChange={handleChange}
                  className={formErrors.image ? 'border-red-500' : ''}
                />
                {formErrors.image && <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description *
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="description"
                  name="description"
                  value={productForm.description}
                  onChange={handleChange}
                  rows={3}
                  className={formErrors.description ? 'border-red-500' : ''}
                />
                {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddProduct}>
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name *
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-name"
                  name="name"
                  value={productForm.name}
                  onChange={handleChange}
                  className={formErrors.name ? 'border-red-500' : ''}
                />
                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Price *
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={productForm.price}
                  onChange={handleChange}
                  className={formErrors.price ? 'border-red-500' : ''}
                />
                {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-stock" className="text-right">
                Stock *
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={productForm.stock}
                  onChange={handleChange}
                  className={formErrors.stock ? 'border-red-500' : ''}
                />
                {formErrors.stock && <p className="text-red-500 text-sm mt-1">{formErrors.stock}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-image" className="text-right">
                Image URL *
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-image"
                  name="image"
                  value={productForm.image}
                  onChange={handleChange}
                  className={formErrors.image ? 'border-red-500' : ''}
                />
                {formErrors.image && <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-description" className="text-right pt-2">
                Description *
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="edit-description"
                  name="description"
                  value={productForm.description}
                  onChange={handleChange}
                  rows={3}
                  className={formErrors.description ? 'border-red-500' : ''}
                />
                {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleEditProduct}>
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-500">
              Are you sure you want to delete <span className="font-semibold">{currentProduct?.name}</span>?
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDeleteProduct}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
