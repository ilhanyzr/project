import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  PlusCircle,
  Pencil,
  Trash2,
  Save,
  Package,
  Users,
  ShoppingCart,
  AlertCircle,
  BarChart3,
  Settings,
  Search,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';

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

interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

interface AuditLog {
  id: string;
  table_name: string;
  operation: string;
  record_id: string;
  created_at: string;
  old_data: any;
  new_data: any;
}

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStock: 0
  });

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

  useEffect(() => {
    checkAdminStatus();
    if (activeTab === 'dashboard') loadDashboardData();
    if (activeTab === 'products') loadProducts();
    if (activeTab === 'orders') loadOrders();
    if (activeTab === 'audit') loadAuditLogs();
  }, [activeTab]);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email === 'admin@example.com') {
      setIsAdmin(true);
    } else {
      navigate('/');
    }
  };

  const loadDashboardData = async () => {
    try {
      const [products, orders] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('orders').select('*')
      ]);

      const totalRevenue = orders.data?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const lowStock = products.data?.filter(p => p.stock < 10).length || 0;

      setStats({
        totalProducts: products.data?.length || 0,
        totalOrders: orders.data?.length || 0,
        totalRevenue,
        lowStock
      });
    } catch (error) {
      showMessage('error', 'Dashboard verisi yüklenirken hata oluştu');
    }
  };

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      showMessage('error', 'Ürünler yüklenirken hata oluştu');
    }
  };

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      showMessage('error', 'Siparişler yüklenirken hata oluştu');
    }
  };

  const loadAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      showMessage('error', 'Denetim kayıtları yüklenirken hata oluştu');
    }
  };

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
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
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select();

      if (error) throw error;
      
      showMessage('success', 'Ürün başarıyla eklendi');
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
    } catch (error) {
      showMessage('error', 'Ürün eklenirken hata oluştu');
    }
  };

  const handleUpdateProduct = async (id: string) => {
    try {
      const product = products.find(p => p.id === id);
      if (!product) return;

      const { error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id);

      if (error) throw error;
      
      showMessage('success', 'Ürün başarıyla güncellendi');
      setEditingId(null);
    } catch (error) {
      showMessage('error', 'Ürün güncellenirken hata oluştu');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      showMessage('success', 'Ürün başarıyla silindi');
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      showMessage('error', 'Ürün silinirken hata oluştu');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return <div>Yükleniyor...</div>;
  }

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Toplam Ürün</p>
            <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
          </div>
          <Package className="w-12 h-12 text-blue-500" />
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Toplam Sipariş</p>
            <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
          </div>
          <ShoppingCart className="w-12 h-12 text-green-500" />
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Toplam Gelir</p>
            <h3 className="text-2xl font-bold">₺{stats.totalRevenue.toLocaleString('tr-TR')}</h3>
          </div>
          <BarChart3 className="w-12 h-12 text-purple-500" />
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Düşük Stok</p>
            <h3 className="text-2xl font-bold">{stats.lowStock}</h3>
          </div>
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Yeni Ürün Ekle</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Ürün Adı"
            value={newProduct.name}
            onChange={handleInputChange}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="price"
            placeholder="Fiyat"
            value={newProduct.price}
            onChange={handleInputChange}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="description"
            placeholder="Açıklama"
            value={newProduct.description}
            onChange={handleInputChange}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="image"
            placeholder="Görsel URL"
            value={newProduct.image}
            onChange={handleInputChange}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="specs"
            placeholder="Özellikler (virgülle ayırın)"
            value={newProduct.specs?.join(',')}
            onChange={handleInputChange}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stok"
            value={newProduct.stock}
            onChange={handleInputChange}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="category"
            value={newProduct.category}
            onChange={handleInputChange}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Ürün Ekle
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Ürün Listesi</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Ürün Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

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
              {filteredProducts.map(product => (
                <tr key={product.id} className="border-t">
                  <td className="p-4">
                    {editingId === product.id ? (
                      <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span>{product.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg"
                      />
                    ) : (
                      `₺${product.price.toLocaleString('tr-TR')}`
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg"
                      />
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        product.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {product.stock}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === product.id ? (
                      <select
                        name="category"
                        value={product.category}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="monitor">Monitör</option>
                        <option value="cpu">İşlemci</option>
                        <option value="storage">Depolama</option>
                        <option value="gpu">Ekran Kartı</option>
                        <option value="audio">Ses Ekipmanı</option>
                      </select>
                    ) : (
                      <span className="capitalize">{product.category}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {editingId === product.id ? (
                        <>
                          <button
                            onClick={() => handleUpdateProduct(product.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Kaydet"
                          >
                            <Check size={20} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                            title="İptal"
                          >
                            <X size={20} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingId(product.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Düzenle"
                          >
                            <Pencil size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Sil"
                          >
                            <Trash2 size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Son Siparişler</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left">Sipariş ID</th>
              <th className="p-4 text-left">Kullanıcı</th>
              <th className="p-4 text-left">Tutar</th>
              <th className="p-4 text-left">Durum</th>
              <th className="p-4 text-left">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t">
                <td className="p-4">
                  <span className="font-mono">{order.id.slice(0, 8)}...</span>
                </td>
                <td className="p-4">{order.user_id.slice(0, 8)}...</td>
                <td className="p-4">₺{order.total_amount.toLocaleString('tr-TR')}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  {new Date(order.created_at).toLocaleDateString('tr-TR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAuditLogs = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Sistem Günlüğü</h3>
      <div className="space-y-4">
        {auditLogs.map(log => (
          <div key={log.id} className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {new Date(log.created_at).toLocaleString('tr-TR')}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                log.operation === 'INSERT' ? 'bg-green-100 text-green-700' :
                log.operation === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                'bg-red-100 text-red-700'
              }`}>
                {log.operation}
              </span>
            </div>
            <p className="mt-1">
              <span className="font-semibold">{log.table_name}</span> tablosunda değişiklik
            </p>
            {log.old_data && (
              <details className="mt-2">
                <summary className="text-sm text-blue-600 cursor-pointer">Değişiklik detayları</summary>
                <pre className="mt-2 text-xs bg-gray-50 p-2 rounded">
                  {JSON.stringify(log.old_data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Paneli</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Admin olarak giriş yapıldı</span>
          <Settings className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      {message.text && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message.type === 'error' ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <Check className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Package className="w-5 h-5" />
          Ürünler
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          Siparişler
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeTab === 'audit' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <AlertCircle className="w-5 h-5" />
          Denetim
        </button>
      </div>

      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'products' && renderProducts()}
      {activeTab === 'orders' && renderOrders()}
      {activeTab === 'audit' && renderAuditLogs()}
    </div>
  );
};

export default Admin;