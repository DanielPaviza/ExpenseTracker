import { useSpendingsStore } from '@stores/spendingsStore'
import { type SelectOption } from 'naive-ui'

import { type ComputedRef, computed } from 'vue'

import { type Spending } from '@/types/Spending'

export function useSpendingFormOptions(formData: ComputedRef<Spending>) {
  const store = useSpendingsStore()

  const categoryOptions = computed(() => {
    return store.categories.map((cat) => ({ label: cat, value: cat }))
  })

  const payerOptions = computed(() => {
    return store.payers.map((payer) => ({ label: payer, value: payer }))
  })

  const subCategoryOptions = computed(() => {
    return [
      ...store.subCategories.map((subCategory) => ({ label: subCategory, value: subCategory })),
      ...formData.value.tags.map((tag) => ({ label: tag, value: tag })),
    ]
  })

  const storeOptions = computed(() => {
    return store.stores.map((store) => ({ label: store, value: store }))
  })

  const tagOptions = computed(() => {
    let allTags: SelectOption[] = store.tags.map((tag) => ({ label: tag, value: tag }))
    if (formData.value.subCategory) {
      allTags.push({ label: formData.value.subCategory, value: formData.value.subCategory })
    }
    return allTags
  })

  return {
    categoryOptions,
    payerOptions,
    subCategoryOptions,
    storeOptions,
    tagOptions,
  }
}
