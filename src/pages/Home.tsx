import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Cpu, HardDrive, CpuIcon as Gpu, Package, Laptop, Gamepad, Mic, X } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const slogans = [
    {
      text: "Gücünüzü Maksimuma Çıkarın",
      subtext: "En son teknoloji parçalarla sisteminizi yükseltin",
      image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=1920"
    },
    {
      text: "Oyuncu Ruhu, Profesyonel Performans",
      subtext: "Premium gaming ekipmanlarıyla rekabette bir adım önde olun",
      image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&q=80&w=1920"
    },
    {
      text: "İş İstasyonunuzu Dönüştürün",
      subtext: "Verimlilik odaklı donanım çözümleri",
      image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=1920"
    },
    {
      text: "Güvenilir Teknoloji, Uygun Fiyat",
      subtext: "Kaliteli parçalar, ekonomik seçenekler",
      image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=1920"
    },
    {
      text: "Geleceğin Teknolojisi Bugün Burada",
      subtext: "En yeni nesil donanımlarla tanışın",
      image: "https://images.unsplash.com/photo-1601932161087-808c75ca8b8c?auto=format&fit=crop&q=80&w=1920"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slogans.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCategoryClick = (category: string) => {
    navigate(`/products?category=${category}`);
  };

  const mainCategories = [
    {
      title: "Hazır Sistemler",
      description: "Profesyonel olarak hazırlanmış bilgisayar sistemleri",
      icon: Package,
      category: "prebuilt",
      subCategories: [
        { name: "Oyun Bilgisayarları", category: "gaming-pc" },
        { name: "İş İstasyonları", category: "workstation" },
        { name: "Ev/Ofis Sistemleri", category: "home-office" },
        { name: "Mini PC'ler", category: "mini-pc" }
      ]
    },
    {
      title: "Laptoplar",
      description: "Her ihtiyaca uygun notebook modelleri",
      icon: Laptop,
      category: "laptop",
      subCategories: [
        { name: "Oyun Laptopları", category: "gaming-laptop" },
        { name: "İş Laptopları", category: "business-laptop" },
        { name: "Ultrabook'lar", category: "ultrabook" },
        { name: "2'si 1 Arada", category: "convertible" }
      ]
    },
    {
      title: "Gaming Ekipmanları",
      description: "Oyuncu mouse, klavye ve aksesuarları",
      icon: Gamepad,
      category: "gaming",
      subCategories: [
        { name: "Gaming Mouse", category: "gaming-mouse" },
        { name: "Gaming Klavye", category: "gaming-keyboard" },
        { name: "Gaming Kulaklık", category: "gaming-headset" },
        { name: "Gaming Monitör", category: "gaming-monitor" }
      ]
    },
    {
      title: "Yayıncı Ekipmanları",
      description: "Profesyonel yayın ve kayıt ekipmanları",
      icon: Mic,
      category: "streaming",
      subCategories: [
        { name: "Mikrofonlar", category: "microphone" },
        { name: "Kameralar", category: "camera" },
        { name: "Işıklandırma", category: "lighting" },
        { name: "Stream Deck", category: "stream-deck" }
      ]
    }
  ];

  const handleMainCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Carousel */}
      <div className="relative h-[500px] mb-12 overflow-hidden rounded-xl">
        {slogans.map((slogan, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
            <img
              src={slogan.image}
              alt={slogan.text}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center px-12">
              <h1 className="text-5xl font-bold text-white mb-4">{slogan.text}</h1>
              <p className="text-2xl text-gray-200">{slogan.subtext}</p>
            </div>
          </div>
        ))}
        
        {/* Carousel Göstergeleri */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slogans.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Popüler Kategoriler */}
      <h2 className="text-3xl font-bold text-center mb-8">Popüler Kategoriler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div 
          onClick={() => handleCategoryClick('monitor')}
          className="bg-white p-8 rounded-xl shadow-lg text-center cursor-pointer transform hover:scale-105 transition-all hover:shadow-xl"
        >
          <Monitor className="w-16 h-16 mx-auto mb-6 text-blue-600" />
          <h3 className="text-2xl font-semibold mb-3">Monitörler</h3>
          <p className="text-gray-600">Her ihtiyaca uygun yüksek kaliteli ekranlar</p>
        </div>
        <div 
          onClick={() => handleCategoryClick('cpu')}
          className="bg-white p-8 rounded-xl shadow-lg text-center cursor-pointer transform hover:scale-105 transition-all hover:shadow-xl"
        >
          <Cpu className="w-16 h-16 mx-auto mb-6 text-blue-600" />
          <h3 className="text-2xl font-semibold mb-3">İşlemciler</h3>
          <p className="text-gray-600">En son nesil CPU'lar</p>
        </div>
        <div 
          onClick={() => handleCategoryClick('storage')}
          className="bg-white p-8 rounded-xl shadow-lg text-center cursor-pointer transform hover:scale-105 transition-all hover:shadow-xl"
        >
          <HardDrive className="w-16 h-16 mx-auto mb-6 text-blue-600" />
          <h3 className="text-2xl font-semibold mb-3">Depolama</h3>
          <p className="text-gray-600">Tüm depolama ihtiyaçları için SSD ve HDD'ler</p>
        </div>
        <div 
          onClick={() => handleCategoryClick('gpu')}
          className="bg-white p-8 rounded-xl shadow-lg text-center cursor-pointer transform hover:scale-105 transition-all hover:shadow-xl"
        >
          <Gpu className="w-16 h-16 mx-auto mb-6 text-blue-600" />
          <h3 className="text-2xl font-semibold mb-3">Ekran Kartları</h3>
          <p className="text-gray-600">Yüksek performanslı GPU'lar</p>
        </div>
      </div>

      {/* Ana Kategoriler */}
      <h2 className="text-3xl font-bold text-center mb-8">Ana Kategoriler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {mainCategories.map((category, index) => (
          <div key={index} className="relative">
            <div 
              onClick={() => handleMainCategoryClick(category.category)}
              className={`bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-lg shadow-md text-center cursor-pointer transform hover:scale-105 transition-all hover:shadow-lg text-white ${
                selectedCategory === category.category ? 'ring-4 ring-blue-300' : ''
              }`}
            >
              <category.icon className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
              <p className="text-blue-100">{category.description}</p>
            </div>

            {/* Alt Kategoriler */}
            {selectedCategory === category.category && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-10 p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-900">Alt Kategoriler</h4>
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-2">
                  {category.subCategories.map((subCat, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCategoryClick(subCat.category)}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      {subCat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mb-12">
        <button
          onClick={() => navigate('/products')}
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tüm Ürünleri İncele
        </button>
      </div>
    </div>
  );
};

export default Home;