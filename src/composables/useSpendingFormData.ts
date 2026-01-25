import { useSpendingsStore } from '@stores/spendingsStore'

import { ComputedRef, computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { SPENDING_FORM_DATA_DEFAULT } from '@/constants/spendingFormData'
import { Spending } from '@/types/Spending'
import { createSpending } from '@/utils/spendingFactory'

export function useSpendingFormData() {
  const store = useSpendingsStore()
  const route = useRoute()

  const isEditMode = computed(() => route.path.startsWith('/edit/'))

  const currentSpending: ComputedRef<Spending | null> = computed(() => {
    if (isEditMode.value) {
      const id = route.params.id as string
      return store.spendings.find((s) => s.id === id) || null
    }
    return null
  })

  const formData = ref<Spending>(createSpending(SPENDING_FORM_DATA_DEFAULT))

  // Watch for changes to the current spending to populate form
  watch(
    currentSpending,
    (newSpending) => {
      // edit spending form
      if (newSpending !== null) {
        formData.value = createSpending(newSpending)
        return
      }

      // Check for template spending for new form
      const templateSpending = store.spendings.find(
        (s) => s.id === (route.query.template as string),
      )

      // If no template found, use default new spending
      if (!templateSpending) {
        formData.value = createSpending(SPENDING_FORM_DATA_DEFAULT)
        return
      }

      // New form data prefilled from template
      const sanitizedTemplate: Partial<Spending> = {
        ...templateSpending,
        id: '',
        createdAt: new Date(),
        editedAt: null,
        documents: [],
      }
      formData.value = createSpending(sanitizedTemplate)
    },
    { immediate: true },
  )

  const totalPrice = computed(() => {
    return formData.value.quantity * formData.value.unitPrice
  })

  // Convert Date to timestamp for date picker
  const createdAtTimestamp = computed({
    get: () => formData.value.createdAt.getTime(),
    set: (value: number) => {
      formData.value.createdAt = new Date(value)
    },
  })

  return {
    formData,
    currentSpending,
    isEditMode,
    totalPrice,
    createdAtTimestamp,
  }
}
