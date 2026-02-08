import HomeContent from '../models/HomeContent.js';

// @desc    Get all home content
// @route   GET /api/content
// @access  Public
export const getHomeContent = async (req, res) => {
  try {
    const content = await HomeContent.getInstance();
    
    // Filter only active items for public view
    const publicContent = {
      ...content.toObject(),
      heroSlides: content.heroSlides.filter(slide => slide.isActive).sort((a, b) => a.order - b.order),
      banners: content.banners.filter(banner => banner.isActive).sort((a, b) => a.order - b.order),
      testimonials: content.testimonials.filter(t => t.isActive).sort((a, b) => a.order - b.order),
      features: content.features.filter(f => f.isActive).sort((a, b) => a.order - b.order),
    };
    
    res.json({
      success: true,
      data: publicContent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching home content',
      error: error.message,
    });
  }
};

// @desc    Get all home content (admin - includes inactive)
// @route   GET /api/admin/content
// @access  Private/Admin
export const getAdminHomeContent = async (req, res) => {
  try {
    const content = await HomeContent.getInstance();
    
    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching home content',
      error: error.message,
    });
  }
};

// @desc    Update section visibility
// @route   PUT /api/admin/content/sections
// @access  Private/Admin
export const updateSectionVisibility = async (req, res) => {
  try {
    const content = await HomeContent.getInstance();
    
    content.sectionVisibility = {
      ...content.sectionVisibility,
      ...req.body,
    };
    content.updatedBy = req.user._id;
    
    await content.save();
    
    res.json({
      success: true,
      message: 'Section visibility updated successfully',
      data: content.sectionVisibility,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating section visibility',
      error: error.message,
    });
  }
};

// Hero Slides Management
// @desc    Add hero slide
// @route   POST /api/admin/content/hero
// @access  Private/Admin
export const addHeroSlide = async (req, res) => {
  try {
    const content = await HomeContent.getInstance();
    
    const newSlide = {
      ...req.body,
      order: content.heroSlides.length,
    };
    
    content.heroSlides.push(newSlide);
    content.updatedBy = req.user._id;
    await content.save();
    
    res.status(201).json({
      success: true,
      message: 'Hero slide added successfully',
      data: content.heroSlides[content.heroSlides.length - 1],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding hero slide',
      error: error.message,
    });
  }
};

// @desc    Update hero slide
// @route   PUT /api/admin/content/hero/:id
// @access  Private/Admin
export const updateHeroSlide = async (req, res) => {
  try {
    const content = await HomeContent.getInstance();
    const slideIndex = content.heroSlides.findIndex(
      slide => slide._id.toString() === req.params.id
    );
    
    if (slideIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found',
      });
    }
    
    content.heroSlides[slideIndex] = {
      ...content.heroSlides[slideIndex].toObject(),
      ...req.body,
      _id: content.heroSlides[slideIndex]._id,
    };
    
    content.updatedBy = req.user._id;
    await content.save();
    
    res.json({
      success: true,
      message: 'Hero slide updated successfully',
      data: content.heroSlides[slideIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating hero slide',
      error: error.message,
    });
  }
};

// @desc    Delete hero slide
// @route   DELETE /api/admin/content/hero/:id
// @access  Private/Admin
export const deleteHeroSlide = async (req, res) => {
  try {
    const content = await HomeContent.getInstance();
    
    content.heroSlides = content.heroSlides.filter(
      slide => slide._id.toString() !== req.params.id
    );
    
    content.updatedBy = req.user._id;
    await content.save();
    
    res.json({
      success: true,
      message: 'Hero slide deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting hero slide',
      error: error.message,
    });
  }
};

// @desc    Reorder hero slides
// @route   PUT /api/admin/content/hero/reorder
// @access  Private/Admin
export const reorderHeroSlides = async (req, res) => {
  try {
    const content = await HomeContent.getInstance();
    const { orderedIds } = req.body;
    
    // Update order based on position in array
    orderedIds.forEach((id, index) => {
      const slide = content.heroSlides.find(s => s._id.toString() === id);
      if (slide) {
        slide.order = index;
      }
    });
    
    content.updatedBy = req.user._id;
    await content.save();
    
    res.json({
      success: true,
      message: 'Hero slides reordered successfully',
      data: content.heroSlides.sort((a, b) => a.order - b.order),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reordering hero slides',
      error: error.message,
    });
  }
};

// Banners Management
// @desc    Add banner
// @route   POST /api/admin/content/banner
// @access  Private/Admin
export const addBanner = async (req, res) => {
  try {
    const content = await HomeContent.getInstance();
    
    const newBanner = {
      ...req.body,
      order: content.banners.length,
    };
    
    content.banners.push(newBanner);
    content.updatedBy = req.user._id;
    await content.save();
    
    res.status(201).json({
      success: true,
      message: 'Banner added successfully',
      data: content.banners[content.banners.length - 1],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding banner',
      error: error.message,
    });
  }
};

// @desc    Update banner
// @route   PUT /api/admin/content/banner/:id
// @access  Private/Admin
export const updateBanner = async (req, res) => {
  try {
    const content = await HomeContent.getInstance();
    const bannerIndex = content.banners.findIndex(
      banner => banner._id.toString() === req.params.id
    );
    
    if (bannerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }
    
    content.banners[bannerIndex] = {
      ...content.banners[bannerIndex].toObject(),
      ...req.body,
      _id: content.banners[bannerIndex]._id,
    };
    
    content.updatedBy = req.user._id;
    await content.save();
    
    res.json({
      success: true,
      message: 'Banner updated successfully',
      data: content.banners[bannerIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating banner',
      error: error.message,
    });
  }
};

// @desc    Delete banner
// @route   DELETE /api/admin/content/banner/:id
// @access  Private/Admin
export const deleteBanner = async (req, res) => {
  try {
    const content = await HomeContent.getInstance();
    
    content.banners = content.banners.filter(
      banner => banner._id.toString() !== req.params.id
    );
    
    content.updatedBy = req.user._id;
    await content.save();
    
    res.json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting banner',
      error: error.message,
    });
  }
};

// Brand Story Management
// @desc    Update brand story
// @route   PUT /api/admin/content/brand-story
// @access  Private/Admin
export const updateBrandStory = async (req, res) => {
  try {
    const content = await HomeContent.getInstance();
    
    content.brandStory = {
      ...content.brandStory,
      ...req.body,
    };
    content.updatedBy = req.user._id;
    
    await content.save();
    
    res.json({
      success: true,
      message: 'Brand story updated successfully',
      data: content.brandStory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating brand story',
      error: error.message,
    });
  }
};

// Testimonials Management
// @desc    Add testimonial
// @route   POST /api/admin/content/testimonial
// @access  Private/Admin
export const addTestimonial = async (req, res) => {
  try {
    const content = await HomeContent.getInstance();
    
    const newTestimonial = {
      ...req.body,
      order: content.testimonials.length,
    };
    
    content.testimonials.push(newTestimonial);
    content.updatedBy = req.user._id;
    await content.save();
    
    res.status(201).json({
      success: true,
      message: 'Testimonial added successfully',
      data: content.testimonials[content.testimonials.length - 1],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding testimonial',
      error: error.message,
    });
  }
};

// @desc    Update testimonial
// @route   PUT /api/admin/content/testimonial/:id
// @access  Private/Admin
export const updateTestimonial = async (req, res) => {
  try {
    const content = await HomeContent.getInstance();
    const testimonialIndex = content.testimonials.findIndex(
      t => t._id.toString() === req.params.id
    );
    
    if (testimonialIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }
    
    content.testimonials[testimonialIndex] = {
      ...content.testimonials[testimonialIndex].toObject(),
      ...req.body,
      _id: content.testimonials[testimonialIndex]._id,
    };
    
    content.updatedBy = req.user._id;
    await content.save();
    
    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: content.testimonials[testimonialIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating testimonial',
      error: error.message,
    });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/admin/content/testimonial/:id
// @access  Private/Admin
export const deleteTestimonial = async (req, res) => {
  try {
    const content = await HomeContent.getInstance();
    
    content.testimonials = content.testimonials.filter(
      t => t._id.toString() !== req.params.id
    );
    
    content.updatedBy = req.user._id;
    await content.save();
    
    res.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting testimonial',
      error: error.message,
    });
  }
};

// Features Management
// @desc    Add feature
// @route   POST /api/admin/content/feature
// @access  Private/Admin
export const addFeature = async (req, res) => {
  try {
    const content = await HomeContent.getInstance();
    
    const newFeature = {
      ...req.body,
      order: content.features.length,
    };
    
    content.features.push(newFeature);
    content.updatedBy = req.user._id;
    await content.save();
    
    res.status(201).json({
      success: true,
      message: 'Feature added successfully',
      data: content.features[content.features.length - 1],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding feature',
      error: error.message,
    });
  }
};

// @desc    Update feature
// @route   PUT /api/admin/content/feature/:id
// @access  Private/Admin
export const updateFeature = async (req, res) => {
  try {
    const content = await HomeContent.getInstance();
    const featureIndex = content.features.findIndex(
      f => f._id.toString() === req.params.id
    );
    
    if (featureIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found',
      });
    }
    
    content.features[featureIndex] = {
      ...content.features[featureIndex].toObject(),
      ...req.body,
      _id: content.features[featureIndex]._id,
    };
    
    content.updatedBy = req.user._id;
    await content.save();
    
    res.json({
      success: true,
      message: 'Feature updated successfully',
      data: content.features[featureIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating feature',
      error: error.message,
    });
  }
};

// @desc    Delete feature
// @route   DELETE /api/admin/content/feature/:id
// @access  Private/Admin
export const deleteFeature = async (req, res) => {
  try {
    const content = await HomeContent.getInstance();
    
    content.features = content.features.filter(
      f => f._id.toString() !== req.params.id
    );
    
    content.updatedBy = req.user._id;
    await content.save();
    
    res.json({
      success: true,
      message: 'Feature deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting feature',
      error: error.message,
    });
  }
};
