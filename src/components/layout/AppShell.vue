<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import AppSidebar from '@/components/layout/AppSidebar.vue'
  import AppTopbar from '@/components/layout/AppTopbar.vue'
  import CategoryPickerModal from '@/components/layout/CategoryPickerModal.vue'
  import ShortcutsModal from '@/components/layout/ShortcutsModal.vue'
  import Loading from '@/components/shared/Loading.vue'
  import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
  import { useSettingsStore } from '@/stores/settingsStore'
  import { useSpendingsStore } from '@/stores/spendingsStore'

  const spendingsStore = useSpendingsStore()
  const settingsStore = useSettingsStore()
  const router = useRouter()
  const route = useRoute()

  const isCategoryPickerOpen = ref(false)
  const isShortcutsOpen = ref(false)

  useKeyboardShortcuts({
    openCategoryPicker: () => (isCategoryPickerOpen.value = true),
    toggleShortcutsHelp: () => (isShortcutsOpen.value = !isShortcutsOpen.value),
  })

  onMounted(async () => {
    await spendingsStore.load()
    await settingsStore.load()

    // Respect the configured start page on a fresh start
    if (route.path === '/dashboard' && settingsStore.settings.startPage === 'spendings')
      await router.replace('/spendings')
  })

  // Start each page at the top when switching sections
  watch(
    () => route.matched[0]?.path,
    () => document.getElementById('app-scroll')?.scrollTo({ top: 0 }),
  )

  const isLoading = computed(() => spendingsStore.isLoading || settingsStore.isLoading)
</script>

<template>
  <Loading v-if="isLoading" />
  <div v-else class="flex h-screen overflow-hidden bg-app text-fg">
    <AppSidebar @open-shortcuts="isShortcutsOpen = true" />

    <div class="flex min-w-0 flex-1 flex-col">
      <AppTopbar @open-category-picker="isCategoryPickerOpen = true" />

      <main id="app-scroll" class="flex-1 overflow-y-auto">
        <div class="mx-auto w-full max-w-[1920px] px-6 py-6 xl:px-10">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>

    <CategoryPickerModal v-model:show="isCategoryPickerOpen" />
    <ShortcutsModal v-model:show="isShortcutsOpen" />
  </div>
</template>

<style scoped>
  .page-enter-active,
  .page-leave-active {
    transition:
      opacity 0.15s ease,
      transform 0.15s ease;
  }
  .page-enter-from {
    opacity: 0;
    transform: translateY(4px);
  }
  .page-leave-to {
    opacity: 0;
  }
</style>
