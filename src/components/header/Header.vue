<script setup lang="ts">
  import MarginContainer from '@components/shared/MarginContainer.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { AddOutline, SettingsOutline } from '@vicons/ionicons5'
  import { NButton, NCollapseTransition, NIcon } from 'naive-ui'

  import { onBeforeUnmount, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  import CategorySelectDropdown from '@/components/header/components/CategorySelectDropdown.vue'
  import CategorySelectionPanel from '@/components/header/components/CategorySelectionPanel.vue'
  import PendingChanges from '@/components/header/components/PendingChanges.vue'
  import { formatCurrency } from '@/composables/useCurrencyFormat'

  const isDev = import.meta.env.DEV
  const store = useSpendingsStore()
  const router = useRouter()

  const isCategorySelectionOpen = ref(false)

  let previousBodyOverflow = ''

  //Handle scroll lock when category selection is open
  watch(isCategorySelectionOpen, (isOpen) => {
    if (isOpen) {
      previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else document.body.style.overflow = previousBodyOverflow
  })

  onBeforeUnmount(() => {
    document.body.style.overflow = previousBodyOverflow
  })

  function openNewSpendingForm(): void {
    router.push('/new')
  }

  function openSettings(): void {
    router.push('/settings')
  }

  function handleCategorySelect(category: string | null): void {
    store.categoryView = category
    isCategorySelectionOpen.value = false
  }
</script>
<template>
  <div
    v-if="isCategorySelectionOpen"
    class="backdrop-blur-lg fixed w-screen h-screen border z-40"
    @click="isCategorySelectionOpen = false"
  ></div>

  <header
    id="header"
    class="sticky z-50 h-fit flex flex-col border-b-2 pt-4 pb-4 border-blue bg-blueLightTransparent backdrop-blur-md"
    :class="{
      'inset-0 overflow-hidden bg-white backdrop-blur-[10px]': isCategorySelectionOpen,
      'top-0 mb-8': !isCategorySelectionOpen,
    }"
  >
    <MarginContainer class="h-full flex flex-col min-h-0 z-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h1 class="text-4xl font-extrabold tracking-tight text-blue me-5">
            {{ $t('appTitle') }}
          </h1>
          <div class="mt-2">
            <n-button type="primary" color="#3b82f6" @click="openNewSpendingForm">
              <n-icon size="32">
                <AddOutline />
              </n-icon>
              <div class="font-bold">
                {{ $t('header.addNewPurchase') }}
              </div>
            </n-button>
          </div>
          <h1 class="text-4xl text-red font-bold ms-10">
            {{ isDev ? 'TEST' : '' }}
          </h1>
        </div>
        <div class="flex items-center gap-4">
          <PendingChanges v-if="store.pendingChanges" />
          <div class="text-blue flex items-center font-semibold text-lg">
            {{ $t('header.totalExpenses') }}: {{ formatCurrency(store.totalPrice) }}
          </div>
          <n-button color="#3b82f6" @click="openSettings">
            <n-icon size="24">
              <SettingsOutline />
            </n-icon>
          </n-button>
        </div>
      </div>
      <CategorySelectDropdown v-model:is-open="isCategorySelectionOpen" />
      <!-- Category Selection Panel with animation -->
      <n-collapse-transition :show="isCategorySelectionOpen" name="expand-down">
        <CategorySelectionPanel
          @select="handleCategorySelect"
          @close="isCategorySelectionOpen = false"
        />
      </n-collapse-transition>
    </MarginContainer>
  </header>
</template>
