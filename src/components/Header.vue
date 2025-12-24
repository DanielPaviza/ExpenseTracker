<script setup lang="ts">
  import MarginContainer from '@components/MarginContainer.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk } from '@utils/formatUtils'
  import { AddOutline } from '@vicons/ionicons5'
  import { NButton, NIcon, useMessage } from 'naive-ui'

  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  import { useSpendingDialogAction } from '@/composables/useSpendingDialogAction'

  const { discardChangesDialog } = useSpendingDialogAction()
  const { t } = useI18n()
  const isDev = import.meta.env.DEV
  const store = useSpendingsStore()
  const router = useRouter()

  function openNewSpendingForm(): void {
    router.push('/new')
  }

  const pendingChanges = computed(() => store.pendingChanges)
  const message = useMessage()

  async function handleSave(): Promise<void> {
    try {
      await store.save()
      message.success(t('messages.changesSavedSuccessfully'))
    } catch (error) {
      message.error(t('messages.errorSavingChanges'))
      console.error('Save error:', error)
    }
  }
</script>
<template>
  <header
    class="sticky top-0 z-50 mb-8 border-b-2 py-4 border-blue bg-whiteTransparent backdrop-blur-md"
  >
    <MarginContainer>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h1 class="text-4xl font-extrabold tracking-tight text-blue me-5">
            {{ $t('header.title') }}
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
          <div v-if="pendingChanges" class="flex items-center animate-breathing">
            <div class="text-orange-600 font-semibold me-4">
              {{ $t('header.unsavedChanges') }}
            </div>
            <div class="flex items-center gap-2 me-10 bg-orange-200 p-2 px-3 shadow rounded-md">
              <n-button type="success" @click="handleSave">
                {{ $t('header.saveChanges') }}
              </n-button>
              <n-button type="error" @click="discardChangesDialog()">
                {{ $t('header.discardChanges') }}
              </n-button>
            </div>
          </div>
          <div class="text-blue flex items-center font-semibold text-lg">
            {{ $t('header.totalExpenses') }}: {{ formatNumberToCzk(store.totalPrice) }}
          </div>
          <select v-model="$i18n.locale" class="ms-2 p-1 border border-gray-300 rounded">
            <option value="en">English</option>
            <option value="cs">Čeština</option>
          </select>
        </div>
      </div>
    </MarginContainer>
  </header>
</template>
<style scoped>
  @keyframes breathing {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.9;
      transform: scale(0.98);
    }
  }

  .animate-breathing {
    animation: breathing 2s ease-in-out infinite;
  }
  .animate-breathing:hover {
    animation-play-state: paused;
  }
</style>
