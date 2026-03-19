import { useSpendingsStore } from '@stores/spendingsStore'
import { type SelectOption } from 'naive-ui'

import { type ComputedRef, computed } from 'vue'

import { type Spending } from '@/types/Spending'

export function useSpendingFormOptions(formData: ComputedRef<Spending>) {
  const store = useSpendingsStore()

  const categoryOptions = computed(() => {
    return store.categories.map((cat) => ({ label: cat, value: cat }))
  })

  const subCategoryOptions = computed(() => {
    return store.subCategories.map((subCat) => ({ label: subCat, value: subCat }))
  })

  const payerOptions = computed(() => {
    return store.payers.map((payer) => ({ label: payer, value: payer }))
  })

  const tableGroupOptions = computed(() => {
    const allTableGroups: SelectOption[] = store.tableGroups.map((tableGroup) => ({
      label: tableGroup,
      value: tableGroup,
    }))
    // Ensure current tableGroup is included in options, but not duplicated
    if (
      formData.value.tableGroup &&
      !allTableGroups.find((tg) => tg.value === formData.value.tableGroup)
    )
      allTableGroups.push({ label: formData.value.tableGroup, value: formData.value.tableGroup })

    return allTableGroups
  })

  const storeOptions = computed(() => {
    return store.stores.map((store) => ({ label: store, value: store }))
  })

  const tagOptions = computed(() => {
    const allTags: SelectOption[] = store.tags.map((tag) => ({ label: tag, value: tag }))
    // Ensure current tableGroup is included in tags options, but not duplicated
    if (
      formData.value.tableGroup &&
      !allTags.find((tag) => tag.value === formData.value.tableGroup)
    )
      allTags.push({ label: formData.value.tableGroup, value: formData.value.tableGroup })

    return allTags
  })

  return {
    categoryOptions,
    subCategoryOptions,
    payerOptions,
    tableGroupOptions,
    storeOptions,
    tagOptions,
  }
}
