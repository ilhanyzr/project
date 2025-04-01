import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PlusCircle, Pencil, Trash2, Save } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  specs: string[];
  rating: number;
  stock: number;
  category: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    image: '',
    specs: [],
    rating: 0,
    stock: 0,
    category: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkAdminStatus();
    loadProducts();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email === 'admin@example.com') {
      setIsAdmin(true);
    } else {
      navigate('/');
    }
  };

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      setMessage('Ürünler yüklenirken hata oluştu');
    } else {
      setProducts(data || []);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingId) {
      setProducts(products.map(p => 
        p.id === editingId 
          ? { ...p, [name]: name === 'specs' ? value.split(',') : name === 'price' || name === 'rating' || name === 'stock' ? Number(value) : value }
          : p
      ));
    } else {
      setNewProduct({
        ...newProduct,
        [name]: name === 'specs' ? value.split(',') : name === 'price' || name === 'rating' || name === 'stock' ? Number(value) : value
      });
    }
  };

  const handleAddProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select();

    if (error) {
      setMessage('Ürün eklenirken hata oluştu');
    } else {
      setMessage('Ürün başarıyla eklendi');
      setProducts([...(data || []), ...products]);
      setNewProduct({
        name: '',
        price: 0,
        description: '',
        image: '',
        specs: [],
        rating: 0,
        stock: 0,
        category: ''
      });
    }
  };

  const handleUpdateProduct = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const { error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id);

    if (error) {
      setMessage('Ürün güncellenirken hata oluştu');
    } else {
      setMessage('Ürün başarıyla güncellendi');
      setEditingId(null);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Ürün silinirken hata oluştu');
    } else {
      setMessage('Ürün başarıyla silindi');
      setProducts(products.filter(p => p.id !== id));
    }
  };

  if (!isAdmin) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Paneli</h1>
      
      {message && (
        <div className={`mb-4 p-4 rounded ${message.includes('hata') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Yeni Ürün Ekle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Ürün Adı"
            value={newProduct.name}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Fiyat"
            value={newProduct.price}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="description"
            placeholder="Açıklama"
            value={newProduct.description}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="image"
            placeholder="Görsel URL"
            value={newProduct.image}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="specs"
            placeholder="Özellikler (virgülle ayırın)"
            value={newProduct.specs?.join(',')}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="rating"
            placeholder="Değerlendirme (0-5)"
            value={newProduct.rating}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stok"
            value={newProduct.stock}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <select
            name="category"
            value={newProduct.category}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="">Kategori Seçin</option>
            <option value="monitor">Monitör</option>
            <option value="cpu">İşlemci</option>
            <option value="storage">Depolama</option>
            <option value="gpu">Ekran Kartı</option>
            <option value="audio">Ses Ekipmanı</option>
          </select>
        </div>
        <button
          onClick={handleAddProduct}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Ürün Ekle
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Ürün Listesi</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left">Ürün</th>
                <th className="p-4 text-left">Fiyat</th>
                <th className="p-4 text-left">Stok</th>
                <th className="p-4 text-left">Kategori</th>
                <th className="p-4 text-left">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-t">
                  <td className="p-4">
                    {editingId === product.id ? (
                      <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleInputChange}
                        className="p-2 border rounded w-full"
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleInputChange}
                        className="p-2 border rounded w-full"
                      />
                    ) : (
                      `₺${product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={handleInputChange}
                        className="p-2 border rounded w-full"
                      />
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === product.id ? (
                      <select
                        name="category"
                        value={product.category}
                        onChange={handleInputChange}
                        className="p-2 border rounded w-full"
                      >
                        <option value="monitor">Monitör</option>
                        <option value="cpu">İşlemci</option>
                        <option value="storage">Depolama</option>
                        <option value="gpu">Ekran Kartı</option>
                        <option value="audio">Ses Ekipmanı</option>
                      </select>
                    ) : (
                      product.category
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {editingId === product.id ? (
                        <button
                          onClick={() => handleUpdateProduct(product.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Save size={20} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingId(product.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Pencil size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;