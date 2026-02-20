<script setup>
const stats = [
  { value: '15+', label: 'Years of Experience' },
  { value: '30+', label: 'Countries Exported To' },
  { value: '500+', label: 'Products Delivered' },
  { value: '100%', label: 'Natural & Biodegradable' },
];

const values = [
  {
    icon: 'pi pi-leaf',
    title: 'Sustainability First',
    desc: 'Every decision we make — from sourcing to shipping — is guided by our commitment to protecting the natural environment we depend on.',
  },
  {
    icon: 'pi pi-shield',
    title: 'Uncompromising Quality',
    desc: 'ISO 9001-certified processes and rigorous testing ensure every product that leaves our facility meets the highest industry standards.',
  },
  {
    icon: 'pi pi-users',
    title: 'Customer Partnership',
    desc: 'We work closely with each client to understand their needs, offering custom solutions and long-term support well beyond the first order.',
  },
  {
    icon: 'pi pi-cog',
    title: 'Innovation & Craft',
    desc: 'Blending traditional coir expertise with modern manufacturing, we continuously develop new products to meet evolving market demands.',
  },
];

const team = [
  {
    name: 'Suresh G.',
    role: 'Founder & Managing Director',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    bio: 'With over 15 years in the coir industry, Suresh founded SG Prime with a vision to bring premium natural fiber products to global markets.',
  },
  {
    name: 'Priya M.',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    bio: 'Priya oversees our manufacturing and logistics, ensuring every order is produced on time and delivered with care.',
  },
  {
    name: 'Arjun K.',
    role: 'Export & Sales Manager',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: 'Arjun manages our international client relationships, coordinating exports across Asia, Europe, and the Americas.',
  },
];
</script>

<template>
  <!-- Hero -->
  <section class="relative py-24 overflow-hidden bg-bark-800">
    <img
      src="https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1400&q=80"
      alt="Coir manufacturing"
      class="absolute inset-0 w-full h-full object-cover opacity-20"
    />
    <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span class="badge bg-earth-500/20 text-earth-400 mb-5 inline-block">Our Story</span>
      <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
        Rooted in Nature,
        <br />
        Built for Industry
      </h1>
      <p class="text-coir-300 text-lg max-w-2xl mx-auto leading-relaxed">
        SG Prime Enterprises was founded with a single belief — that nature provides the best
        solutions. Since 2009, we've been turning coconut husk fiber into world-class industrial
        products.
      </p>
    </div>
  </section>

  <!-- Stats -->
  <section class="bg-earth-500 py-12">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div v-for="stat in stats" :key="stat.label">
          <p class="text-4xl font-display font-bold text-white mb-1">{{ stat.value }}</p>
          <p class="text-earth-100 text-sm font-medium">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Our Story -->
  <section class="py-20 bg-cream">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <!-- Image -->
        <div class="relative">
          <img
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"
            alt="Coir products"
            class="rounded-3xl w-full h-96 object-cover shadow-xl"
          />
          <div
            class="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-lg border border-coir-100 p-5 hidden md:block"
          >
            <p class="font-display font-bold text-bark-800 text-2xl">Since 2009</p>
            <p class="text-bark-500 text-sm">Crafting natural solutions</p>
          </div>
        </div>

        <!-- Text -->
        <div>
          <span class="badge bg-earth-100 text-earth-600 mb-5 inline-block">Who We Are</span>
          <h2 class="section-title">From Farm to Global Market</h2>
          <div class="space-y-4 text-bark-600 leading-relaxed">
            <p>
              SG Prime Enterprises began as a small family-run operation in southern India, working
              directly with coconut farmers to process and manufacture coir products for the local
              market. Our founder's vision was simple — create durable, sustainable alternatives to
              synthetic materials.
            </p>
            <p>
              Over the years, that vision grew into a vertically integrated manufacturing facility
              with ISO 9001 certification, serving clients across erosion control, horticulture,
              landscaping, and construction sectors worldwide.
            </p>
            <p>
              Today, our products are trusted by government agencies, landscaping contractors,
              greenhouse growers, and agricultural businesses across more than 30 countries — all
              while maintaining the same commitment to quality and sustainability we started with.
            </p>
          </div>
          <RouterLink to="/contact" class="btn-primary mt-8 inline-flex">
            Get in Touch
            <i class="pi pi-arrow-right ml-2 text-xs"></i>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>

  <!-- Our Values -->
  <section class="py-20 bg-bark-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14">
        <span class="badge bg-earth-500/20 text-earth-400 mb-4 inline-block">What Drives Us</span>
        <h2 class="text-3xl md:text-4xl font-display font-bold text-white mb-3">Our Core Values</h2>
        <p class="text-coir-300 text-lg max-w-xl mx-auto">
          The principles that guide every product we make and every relationship we build.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="value in values"
          :key="value.title"
          class="bg-bark-700/50 rounded-2xl p-7 border border-bark-600 hover:border-earth-500/50 transition-colors group"
        >
          <div
            class="w-12 h-12 rounded-xl bg-earth-500/20 flex items-center justify-center mb-5 group-hover:bg-earth-500/30 transition-colors"
          >
            <i :class="value.icon" class="text-earth-400 text-xl"></i>
          </div>
          <h3 class="font-display font-semibold text-white text-lg mb-3">{{ value.title }}</h3>
          <p class="text-coir-300 text-sm leading-relaxed">{{ value.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Manufacturing Process -->
  <section class="py-20 bg-coir-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14">
        <span class="badge bg-earth-100 text-earth-600 mb-4 inline-block">
          From Husk to Product
        </span>
        <h2 class="section-title">How We Manufacture</h2>
        <p class="section-subtitle max-w-xl mx-auto">
          A streamlined process that respects the material and the environment at every step.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          v-for="(step, i) in [
            {
              icon: 'pi pi-home',
              title: 'Sourcing',
              desc: 'Coconut husks are responsibly sourced from certified farms in southern India.',
            },
            {
              icon: 'pi pi-wrench',
              title: 'Processing',
              desc: 'Husks are de-fibered, cleaned, and graded by our in-house machinery.',
            },
            {
              icon: 'pi pi-star',
              title: 'Manufacturing',
              desc: 'Fibers are woven, pressed, or bonded into finished products using ISO-certified processes.',
            },
            {
              icon: 'pi pi-send',
              title: 'Export',
              desc: 'Products are quality-checked, packaged, and dispatched to clients worldwide.',
            },
          ]"
          :key="step.title"
          class="relative bg-white rounded-2xl p-7 shadow-sm border border-coir-100"
        >
          <span
            class="absolute -top-4 -left-2 w-8 h-8 rounded-full bg-earth-500 text-white text-sm font-bold flex items-center justify-center shadow-md"
          >
            {{ i + 1 }}
          </span>
          <i :class="step.icon" class="text-earth-500 text-2xl mb-4 block"></i>
          <h3 class="font-display font-semibold text-bark-800 text-lg mb-2">{{ step.title }}</h3>
          <p class="text-bark-500 text-sm leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Team -->
  <section class="py-20 bg-cream">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14">
        <span class="badge bg-earth-100 text-earth-600 mb-4 inline-block">
          The People Behind It
        </span>
        <h2 class="section-title">Meet Our Team</h2>
        <p class="section-subtitle max-w-xl mx-auto">
          Experienced professionals committed to delivering the best coir products in the industry.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="member in team"
          :key="member.name"
          class="bg-white rounded-2xl overflow-hidden shadow-sm border border-coir-100 card-hover"
        >
          <div class="h-60 overflow-hidden">
            <img
              :src="member.image"
              :alt="member.name"
              class="w-full h-full object-cover object-top"
            />
          </div>
          <div class="p-6">
            <h3 class="font-display font-bold text-bark-800 text-lg">{{ member.name }}</h3>
            <p class="text-earth-600 text-sm font-medium mb-3">{{ member.role }}</p>
            <p class="text-bark-500 text-sm leading-relaxed">{{ member.bio }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-earth-500 py-16">
    <div class="max-w-3xl mx-auto px-4 text-center">
      <h2 class="text-3xl font-display font-bold text-white mb-4">Ready to Work Together?</h2>
      <p class="text-earth-100 text-lg mb-8">
        Whether you need bulk coir products or a custom solution, our team is ready to help.
      </p>
      <div class="flex flex-wrap gap-4 justify-center">
        <RouterLink
          to="/contact"
          class="inline-flex items-center gap-2 px-8 py-3 bg-white text-earth-600 font-semibold rounded-lg hover:bg-earth-50 transition-colors shadow-md"
        >
          Contact Us
          <i class="pi pi-envelope text-sm"></i>
        </RouterLink>
        <RouterLink
          to="/products"
          class="inline-flex items-center gap-2 px-8 py-3 border-2 border-white/70 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
        >
          Browse Products
        </RouterLink>
      </div>
    </div>
  </section>
</template>
