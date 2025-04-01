import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, Truck, Shield, CreditCard, Package2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';

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

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          product_id,
          user_id,
          rating,
          comment,
          created_at,
          user_name:user_profiles(name)
        `)
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-600">Ürün yükleniyor...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Ürün bulunamadı</h2>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  };

  const installmentOptions = [
    { months: 3, rate: 1.89 },
    { months: 6, rate: 2.19 },
    { months: 12, rate: 2.49 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ürün Görseli */}
        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Ürün Bilgileri */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 ${
                    index < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">({reviews.length} değerlendirme)</span>
          </div>

          <div className="text-3xl font-bold text-blue-600">
            ₺{product.price.toLocaleString('tr-TR')}
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-green-600">
              <Truck className="w-5 h-5 mr-2" />
              <span>Ücretsiz Kargo</span>
            </div>
            <div className="flex items-center text-blue-600">
              <Shield className="w-5 h-5 mr-2" />
              <span>2 Yıl Garanti</span>
            </div>
            <div className="flex items-center text-purple-600">
              <Package2 className="w-5 h-5 mr-2" />
              <span>Stok Durumu: {product.stock} adet</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Sepete Ekle
          </button>
        </div>
      </div>

      {/* Sekmeler */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Genel Bakış
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'specs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Teknik Özellikler
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Değerlendirmeler
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payment'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ödeme Seçenekleri
            </button>
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'overview' && (
            <div className="prose max-w-none">
              <p className="text-gray-600">{product.description}</p>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Öne Çıkan Özellikler</h3>
                <ul className="space-y-2">
                  {product.specs.slice(0, 3).map((spec, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="divide-y divide-gray-200">
                {product.specs.map((spec, index) => (
                  <div key={index} className="flex py-4 px-6">
                    <div className="w-1/3 text-gray-600">Özellik {index + 1}</div>
                    <div className="w-2/3 font-medium">{spec}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="font-medium">{review.user_name || 'Kullanıcı'}</div>
                      <span className="mx-2">•</span>
                      <div className="text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`w-4 h-4 ${
                            index < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Taksit Seçenekleri</h3>
                <div className="space-y-4">
                  {installmentOptions.map((option) => {
                    const monthlyPayment = (product.price * (1 + option.rate / 100)) / option.months;
                    return (
                      <div key={option.months} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{option.months} Taksit</div>
                          <div className="text-sm text-gray-500">%{option.rate} faiz oranı</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₺{monthlyPayment.toFixed(2)}/ay</div>
                          <div className="text-sm text-gray-500">
                            Toplam: ₺{(monthlyPayment * option.months).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Ödeme Yöntemleri</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center p-4 border rounded-lg">
                    <CreditCard className="w-6 h-6 text-blue-600 mr-2" />
                    <span>Kredi Kartı</span>
                  </div>
                  <div className="flex items-center p-4 border rounded-lg">
                    <Package2 className="w-6 h-6 text-green-600 mr-2" />
                    <span>Havale/EFT</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;