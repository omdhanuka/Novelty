import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterSidebar = ({ filters, activeFilters, onFilterChange, onClearFilters, isMobile, onClose }) => {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    colors: true,
    material: true,
    stock: true,
    discount: true,
  });

  const [priceRange, setPriceRange] = useState({
    min: activeFilters.minPrice || 0,
    max: activeFilters.maxPrice || 10000,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceChange = (type, value) => {
    const newRange = { ...priceRange, [type]: Number(value) };
    setPriceRange(newRange);
    onFilterChange('price', newRange);
  };

  const handleCheckboxChange = (filterType, value) => {
    const currentValues = activeFilters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange(filterType, newValues);
  };

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        {openSections[sectionKey] ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>
      <AnimatePresence>
        {openSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 space-y-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onClearFilters}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Clear All
          </button>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Categories */}
        {filters.categories && filters.categories.length > 0 && (
          <FilterSection title="Categories" sectionKey="category">
            {filters.categories.map((category) => (
              <label key={category._id} className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(activeFilters.category || []).includes(category._id)}
                  onChange={() => handleCheckboxChange('category', category._id)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-indigo-600">
                  {category.name}
                </span>
              </label>
            ))}
          </FilterSection>
        )}

        {/* Price Range */}
        <FilterSection title="Price Range" sectionKey="price">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-600 block mb-1">Min</label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="₹0"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600 block mb-1">Max</label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="₹10000"
                />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>₹{priceRange.min}</span>
              <span>₹{priceRange.max}</span>
            </div>
          </div>
        </FilterSection>

        {/* Colors */}
        {filters.colors && filters.colors.length > 0 && (
          <FilterSection title="Colors" sectionKey="colors">
            <div className="grid grid-cols-4 gap-2">
              {filters.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleCheckboxChange('colors', color)}
                  className={`relative aspect-square rounded-lg border-2 transition-all ${
                    (activeFilters.colors || []).includes(color)
                      ? 'border-indigo-600 ring-2 ring-indigo-200'
                      : 'border-gray-300 hover:border-indigo-400'
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                >
                  {(activeFilters.colors || []).includes(color) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Material */}
        {filters.materials && filters.materials.length > 0 && (
          <FilterSection title="Material" sectionKey="material">
            {filters.materials.map((material) => (
              <label key={material} className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(activeFilters.material || []).includes(material)}
                  onChange={() => handleCheckboxChange('material', material)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-indigo-600">
                  {material}
                </span>
              </label>
            ))}
          </FilterSection>
        )}

        {/* Stock Status */}
        <FilterSection title="Availability" sectionKey="stock">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={activeFilters.inStockOnly || false}
              onChange={(e) => onFilterChange('inStockOnly', e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-indigo-600">
              In Stock Only
            </span>
          </label>
        </FilterSection>

        {/* Discount */}
        <FilterSection title="Discount" sectionKey="discount">
          {[10, 20, 30, 40, 50].map((discount) => (
            <label key={discount} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="radio"
                name="discount"
                checked={activeFilters.discount === discount}
                onChange={() => onFilterChange('discount', discount)}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-indigo-600">
                {discount}% or more
              </span>
            </label>
          ))}
        </FilterSection>

        {/* Special Filters */}
        <FilterSection title="Special" sectionKey="special">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={activeFilters.isBestSeller || false}
              onChange={(e) => onFilterChange('isBestSeller', e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-indigo-600">
              Best Sellers
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={activeFilters.isNewArrival || false}
              onChange={(e) => onFilterChange('isNewArrival', e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-indigo-600">
              New Arrivals
            </span>
          </label>
        </FilterSection>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed inset-0 z-50 bg-white"
      >
        {sidebarContent}
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md h-fit sticky top-4">
      {sidebarContent}
    </div>
  );
};

export default FilterSidebar;
