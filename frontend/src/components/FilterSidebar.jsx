import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// Color mapping for consistent display
const COLOR_MAP = {
  'black': '#000000',
  'white': '#FFFFFF',
  'red': '#DC2626',
  'blue': '#2563EB',
  'green': '#16A34A',
  'yellow': '#EAB308',
  'orange': '#EA580C',
  'purple': '#9333EA',
  'pink': '#EC4899',
  'brown': '#92400E',
  'gray': '#6B7280',
  'grey': '#6B7280',
  'beige': '#D4C5B9',
  'navy': '#1E3A8A',
  'maroon': '#7F1D1D',
  'gold': '#F59E0B',
  'silver': '#D1D5DB',
  'cream': '#FEF3C7',
};

// Helper function to get color hex code
const getColorHex = (colorName) => {
  const normalized = colorName.toLowerCase().trim();
  return COLOR_MAP[normalized] || colorName.toLowerCase();
};

// Normalize various color input shapes to a single string value
const normalizeColorInput = (color) => {
  if (!color && color !== 0) return null;

  if (Array.isArray(color)) {
    if (color.length === 0) return null;
    if (color.length === 1) return String(color[0]);
    return color.map(String).join(', ');
  }

  if (typeof color === 'object') {
    return String(color.value || color.name || color.label || color.hex || JSON.stringify(color));
  }

  if (typeof color === 'string') {
    const trimmed = color.trim();
    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeColorInput(parsed);
      } catch (e) {
        // not JSON, fall through
      }
    }
    return trimmed || null;
  }

  return String(color);
};

// FilterSection Component - Defined outside to avoid recreation on each render
const FilterSection = ({ title, sectionKey, openSections, toggleSection, children }) => (
  <div className="pb-5 mb-5 border-b border-[#E5E7EB] last:border-b-0 last:pb-0 last:mb-0">
    <button
      onClick={() => toggleSection(sectionKey)}
      className="flex items-center justify-between w-full py-2 text-left group"
    >
      <span className="font-semibold text-[#111827] group-hover:text-[#6D28D9] transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
        {title}
      </span>
      {openSections[sectionKey] ? (
        <ChevronUp className="w-4 h-4 text-[#6B7280] group-hover:text-[#6D28D9] transition-colors" />
      ) : (
        <ChevronDown className="w-4 h-4 text-[#6B7280] group-hover:text-[#6D28D9] transition-colors" />
      )}
    </button>
    <AnimatePresence>
      {openSections[sectionKey] && (
        <div key={sectionKey} className="mt-3 space-y-2.5">
          {children}
        </div>
      )}
    </AnimatePresence>
  </div>
);

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

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E7EB]">
        <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Filters
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onClearFilters}
            className="text-sm text-[#6D28D9] hover:text-[#5B21B6] font-medium transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Clear All
          </button>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#F3F4F6] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Debug logs moved outside JSX */}
        {(() => {
          console.log('FilterSidebar - filters:', filters);
          console.log('FilterSidebar - categories:', filters.categories);
          console.log('FilterSidebar - colors:', filters.colors);
          return null;
        })()}
        
        {/* Categories */}
        {filters.categories && filters.categories.length > 0 ? (
          <FilterSection title="Categories" sectionKey="category" openSections={openSections} toggleSection={toggleSection}>
            {filters.categories.map((category) => (
              <label key={category._id} className="flex items-center space-x-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(activeFilters.category || []).includes(category._id)}
                  onChange={() => handleCheckboxChange('category', category._id)}
                  className="w-4 h-4 text-[#6D28D9] border-[#E5E7EB] rounded focus:ring-[#6D28D9]"
                />
                <span className="text-sm text-[#374151] group-hover:text-[#6D28D9] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {category.name}
                </span>
              </label>
            ))}
          </FilterSection>
        ) : (
          <div className="pb-5 mb-5 border-b border-[#E5E7EB]">
            <div className="text-sm text-[#6B7280]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Categories: {filters.categories ? `Empty (${filters.categories.length})` : 'Not loaded'}
            </div>
          </div>
        )}

        {/* Price Range */}
        <FilterSection title="Price Range" sectionKey="price" openSections={openSections} toggleSection={toggleSection}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-[#6B7280] block mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Min</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">₹</span>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-[#6B7280] block mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Max</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">₹</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
                    placeholder="10000"
                  />
                </div>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#6D28D9]"
            />
            <div className="flex justify-between text-xs text-[#6B7280]" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span>₹{priceRange.min}</span>
              <span>₹{priceRange.max}</span>
            </div>
          </div>
        </FilterSection>

        {/* Colors */}
        {filters.colors && filters.colors.length > 0 ? (
          <FilterSection title="Colors" sectionKey="colors" openSections={openSections} toggleSection={toggleSection}>
            <div className="grid grid-cols-5 gap-2.5">
              {(() => {
                const rawColors = Array.isArray(filters.colors) ? filters.colors : [];
                const normalized = rawColors.map(normalizeColorInput).filter(Boolean);
                const unique = Array.from(new Set(normalized));
                const activeColorSet = new Set((activeFilters.colors || []).map(normalizeColorInput).filter(Boolean));

                return unique.map((colorValue) => {
                  const title = colorValue;
                  const colorHex = getColorHex(title || '');
                  const normalizedLower = (String(title || '')).toLowerCase().trim();
                  const isLightColor = ['white', 'cream', 'beige', 'yellow', 'silver'].includes(normalizedLower);

                  return (
                    <div key={title} className="flex flex-col items-center">
                      <button
                        onClick={() => handleCheckboxChange('colors', title)}
                        className={`relative w-full aspect-square rounded-lg border-2 transition-all overflow-hidden flex items-center justify-center ${
                          activeColorSet.has(title)
                            ? 'border-[#6D28D9] ring-2 ring-[#6D28D9] ring-opacity-30'
                            : 'border-[#E5E7EB] hover:border-[#6D28D9]'
                        }`}
                        title={title}
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md shadow-sm bg-white border border-[#E5E7EB]">
                          <span
                            className={`block w-4 h-4 rounded-sm ${isLightColor ? 'border border-gray-200' : ''}`}
                            style={{ backgroundColor: colorHex || 'transparent' }}
                            aria-hidden
                          />
                        </span>

                        {!colorHex && (
                          <div className="absolute inset-0 flex items-center justify-center text-xs text-[#374151]">{title}</div>
                        )}

                        {activeColorSet.has(title) && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <svg 
                              className={`w-4 h-4 drop-shadow-lg ${isLightColor ? 'text-gray-800' : 'text-white'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                      <span className="mt-2 text-xs text-[#374151] truncate" style={{ maxWidth: '100%' }}>{title}</span>
                    </div>
                  );
                });
              })()}
            </div>
          </FilterSection>
        ) : (
          <div className="pb-5 mb-5 border-b border-[#E5E7EB]">
            <div className="text-sm text-[#6B7280]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Colors: {filters.colors ? `Empty (${filters.colors.length})` : 'Not loaded'}
            </div>
          </div>
        )}

        {/* Material */}
        {filters.materials && filters.materials.length > 0 && (
          <FilterSection title="Material" sectionKey="material" openSections={openSections} toggleSection={toggleSection}>
            {filters.materials.map((material) => (
              <label key={material} className="flex items-center space-x-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(activeFilters.material || []).includes(material)}
                  onChange={() => handleCheckboxChange('material', material)}
                  className="w-4 h-4 text-[#6D28D9] border-[#E5E7EB] rounded focus:ring-[#6D28D9]"
                />
                <span className="text-sm text-[#374151] group-hover:text-[#6D28D9] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {material}
                </span>
              </label>
            ))}
          </FilterSection>
        )}

        {/* Stock Status */}
        <FilterSection title="Availability" sectionKey="stock" openSections={openSections} toggleSection={toggleSection}>
          <label className="flex items-center space-x-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={activeFilters.inStockOnly || false}
              onChange={(e) => onFilterChange('inStockOnly', e.target.checked)}
              className="w-4 h-4 text-[#6D28D9] border-[#E5E7EB] rounded focus:ring-[#6D28D9]"
            />
            <span className="text-sm text-[#374151] group-hover:text-[#6D28D9] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
              In Stock Only
            </span>
          </label>
        </FilterSection>

        {/* Discount */}
        <FilterSection title="Discount" sectionKey="discount" openSections={openSections} toggleSection={toggleSection}>
          {[10, 20, 30, 40, 50].map((discount) => (
            <label key={discount} className="flex items-center space-x-2.5 cursor-pointer group">
              <input
                type="radio"
                name="discount"
                checked={activeFilters.discount === discount}
                onChange={() => onFilterChange('discount', discount)}
                className="w-4 h-4 text-[#6D28D9] border-[#E5E7EB] focus:ring-[#6D28D9]"
              />
              <span className="text-sm text-[#374151] group-hover:text-[#6D28D9] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                {discount}% or more
              </span>
            </label>
          ))}
        </FilterSection>

        {/* Special Filters */}
        <FilterSection title="Special" sectionKey="special" openSections={openSections} toggleSection={toggleSection}>
          <label className="flex items-center space-x-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={activeFilters.isBestSeller || false}
              onChange={(e) => onFilterChange('isBestSeller', e.target.checked)}
              className="w-4 h-4 text-[#6D28D9] border-[#E5E7EB] rounded focus:ring-[#6D28D9]"
            />
            <span className="text-sm text-[#374151] group-hover:text-[#6D28D9] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
              Best Sellers
            </span>
          </label>
          <label className="flex items-center space-x-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={activeFilters.isNewArrival || false}
              onChange={(e) => onFilterChange('isNewArrival', e.target.checked)}
              className="w-4 h-4 text-[#6D28D9] border-[#E5E7EB] rounded focus:ring-[#6D28D9]"
            />
            <span className="text-sm text-[#374151] group-hover:text-[#6D28D9] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
              New Arrivals
            </span>
          </label>
        </FilterSection>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed right-0 top-0 bottom-0 w-80 z-50 bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
        <div className="p-5">
          {sidebarContent}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl h-fit sticky top-4">
      {sidebarContent}
    </div>
  );
};

export default FilterSidebar;
