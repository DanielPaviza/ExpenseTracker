<script setup lang="ts">
  import {
    NDatePicker,
    NFormItem,
    NInput,
    NInputNumber,
    NSelect,
    type SelectOption,
  } from 'naive-ui'

  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { formatCurrency } from '@/composables/useCurrencyFormat'
  import type { Spending } from '@/types/Spending'

  const { categoryOptions, subCategoryOptions, payerOptions, storeOptions } = defineProps<{
    categoryOptions: SelectOption[]
    subCategoryOptions: SelectOption[]
    payerOptions: SelectOption[]
    storeOptions: SelectOption[]
  }>()

  const { t } = useI18n()

  const formData = defineModel<Spending>('formData')
  const totalPrice = computed(() => {
    if (!formData.value) return 0
    return formData.value.quantity * formData.value.unitPrice
  })

  const createdAtTimestamp = computed({
    get: (): number => formData.value?.createdAt.getTime() || Date.now(),
    set: (value: number): void => {
      if (formData.value) formData.value.createdAt = new Date(value)
    },
  })
</script>

<template>
  <div v-if="formData" class="flex-1">
    <!-- Required fields -->
    <n-form-item :label="t('form.category')" path="category">
      <n-select
        v-model:value="formData.category"
        :options="categoryOptions"
        :placeholder="t('form.selectCategory')"
        filterable
        tag
      />
    </n-form-item>

    <n-form-item :label="t('form.subCategory')" path="subCategory">
      <n-select
        v-model:value="formData.subCategory"
        :options="subCategoryOptions"
        filterable
        tag
        placeholder=""
      />
    </n-form-item>

    <n-form-item :label="t('form.type')" path="type">
      <n-input v-model:value="formData.type" placeholder="" />
    </n-form-item>

    <n-form-item :label="t('form.name')" path="name">
      <n-input v-model:value="formData.name" placeholder="" />
    </n-form-item>

    <n-form-item :label="t('form.creationDate')" path="createdAt">
      <n-date-picker
        v-model:value="createdAtTimestamp"
        type="datetime"
        placeholder=""
        class="w-full"
        format="dd.MM.yyyy HH:mm"
      />
    </n-form-item>

    <n-form-item :label="t('form.payer')" path="payer">
      <n-select
        v-model:value="formData.payer"
        :options="payerOptions"
        placeholder=""
        filterable
        tag
      />
    </n-form-item>

    <n-form-item :label="t('form.store')" path="store">
      <n-select
        v-model:value="formData.store"
        :options="storeOptions"
        placeholder=""
        filterable
        tag
        clearable
      />
    </n-form-item>

    <div class="flex gap-4">
      <n-form-item :label="t('form.quantity')" path="quantity" class="flex-1">
        <n-input-number
          v-model:value="formData.quantity"
          :min="0"
          :step="1"
          class="w-full"
          placeholder="1"
        />
      </n-form-item>

      <n-form-item :label="t('form.unitPrice')" path="unitPrice" class="flex-1">
        <n-input-number
          v-model:value="formData.unitPrice"
          :min="0"
          :step="100"
          placeholder="0"
          :show-button="false"
          class="w-full"
        />
      </n-form-item>
    </div>

    <div
      class="mb-4 flex items-center justify-between rounded-xl border border-primary/20 bg-primary-soft px-5 py-3"
    >
      <span class="text-sm font-medium text-fg-muted">{{ t('form.totalPrice') }}</span>
      <span class="text-xl font-semibold tabular-nums text-primary">
        {{ formatCurrency(totalPrice) }}
      </span>
    </div>
  </div>
</template>
