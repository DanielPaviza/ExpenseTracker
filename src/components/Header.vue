<script setup lang="ts">
  import MarginContainer from '@components/MarginContainer.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk } from '@utils/formatUtils'
  import { AddOutline } from '@vicons/ionicons5'
  import { NButton, NIcon } from 'naive-ui'

  import { useRouter } from 'vue-router'

  const store = useSpendingsStore()
  const router = useRouter()

  function openNewSpendingForm() {
    router.push('/new')
  }

  // Pending changes logic kept for future use
  // const pendingChanges = computed(() => store.pendingChanges)
  // const dialog = useDialog()
  // const message = useMessage()
  //
  // async function handleSave() {
  //   try {
  //     await store.save()
  //     message.success('Změny byly úspěšně uloženy')
  //   } catch (error) {
  //     message.error('Chyba při ukládání změn')
  //     console.error('Save error:', error)
  //   }
  // }
  //
  // function handleDiscard() {
  //   dialog.warning({
  //     title: 'Zahodit změny',
  //     content: 'Opravdu chcete zahodit všechny neuložené změny? Tato akce je nevratná.',
  //     positiveText: 'Zahodit',
  //     negativeText: 'Zrušit',
  //     onPositiveClick: () => {
  //       store.discardChanges()
  //       message.info('Změny byly zahozeny')
  //     },
  //   })
  // }
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
        </div>
      </div>
    </MarginContainer>
  </header>
</template>
