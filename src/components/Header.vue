<script setup lang="ts">
  import MarginContainer from '@components/MarginContainer.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk } from '@utils/formatUtils'
  import { AddOutline, SaveOutline, WarningOutline } from '@vicons/ionicons5'
  import { NButton, NIcon } from 'naive-ui'

  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  const store = useSpendingsStore()
  const router = useRouter()
  const pendingChanges = computed(() => store.pendingChanges)

  function openNewSpendingForm() {
    router.push('/new')
  }

  async function handleSave() {
    await store.save()
  }
</script>
<template>
  <header
    class="sticky top-0 z-50 mb-8 border-b-2 py-4 border-blue bg-whiteTransparent backdrop-blur-md"
  >
    <MarginContainer>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h1 class="text-4xl font-extrabold tracking-tight text-blue me-5">Evidence nákupů</h1>
          <div class="mt-2">
            <n-button type="primary" color="#3b82f6" @click="openNewSpendingForm">
              <n-icon size="32">
                <AddOutline />
              </n-icon>
              <div class="font-bold">Přidat nový nákup</div>
            </n-button>
          </div>
        </div>
        <div class="flex items-center">
          <div class="text-blue flex items-center font-semibold">
            Celkové výdaje: {{ formatNumberToCzk(store.totalPrice) }}
          </div>
          <!-- Pending changes indicator -->
          <div
            v-if="pendingChanges"
            class="flex items-center gap-3 bg-orange-50 border border-orange-300 rounded-lg px-4 py-2 ms-5"
          >
            <n-icon size="24" color="#f97316">
              <WarningOutline />
            </n-icon>
            <span class="text-orange-700 font-semibold">Neuložené změny</span>
            <n-button type="warning" @click="handleSave" :loading="store.isLoading">
              <template #icon>
                <n-icon>
                  <SaveOutline />
                </n-icon>
              </template>
              Uložit
            </n-button>
          </div>
        </div>
      </div>
    </MarginContainer>
  </header>
</template>
