<template>
  <div class="not-found-page">
    <NavBar />

    <div class="not-found-content">
      <div class="container">
        <div class="error-box">
          <h1 class="error-code">404</h1>
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <div class="actions">
            <Button
              label="Go Home"
              icon="pi pi-home"
              class="btn-primary"
              @click="$router.push('/')"
            />
            <Button
              label="View Products"
              class="btn-secondary"
              @click="$router.push('/products')"
            />
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Footer from '@/components/Footer.vue';
import NavBar from '@/components/NavBar.vue';
</script>

<style scoped>
.not-found-page {
  padding-top: 70px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.not-found-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, var(--color-canvas) 0%, white 100%);
}

.error-box {
  text-align: center;
  max-width: 600px;
}

.error-code {
  font-size: 8rem;
  color: var(--color-secondary);
  margin-bottom: 0;
  line-height: 1;
  font-family: var(--font-display);
}

.error-box h2 {
  margin-bottom: 1rem;
}

.error-box p {
  font-size: 1.125rem;
  color: var(--color-text);
  opacity: 0.75;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.actions button {
  padding: 1rem 2rem;
}
</style>
