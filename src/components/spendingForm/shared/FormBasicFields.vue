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

  import type { Spending } from '@/types/Spending'

  const { categoryOptions, payerOptions, storeOptions, isEditMode } = defineProps<{
    categoryOptions: SelectOption[]
    payerOptions: SelectOption[]
    storeOptions: SelectOption[]
    isEditMode: boolean
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
      if (formData.value) {
        formData.value.createdAt = new Date(value)
      }
    },
  })
</script>

<template>
  <div class="flex-1" v-if="formData">
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

    <n-form-item :label="t('form.type')" path="type">
      <n-input v-model:value="formData.type" :placeholder="t('form.typePlaceholder')" />
    </n-form-item>

    <n-form-item :label="t('form.name')" path="name">
      <n-input v-model:value="formData.name" :placeholder="t('form.namePlaceholder')" />
    </n-form-item>

    <n-form-item v-if="!isEditMode" :label="t('form.creationDate')" path="createdAt">
      <n-date-picker
        v-model:value="createdAtTimestamp"
        type="datetime"
        :placeholder="t('form.selectDateTime')"
        class="w-full"
        format="dd.MM.yyyy HH:mm"
      />
    </n-form-item>

    <n-form-item :label="t('form.payer')" path="payer">
      <n-select
        v-model:value="formData.payer"
        :options="payerOptions"
        :placeholder="t('form.selectPayer')"
        filterable
        tag
      />
    </n-form-item>

    <n-form-item :label="t('form.store')" path="store">
      <n-select
        v-model:value="formData.store"
        :options="storeOptions"
        :placeholder="t('form.selectStore')"
        filterable
        tag
        clearable
      />
    </n-form-item>

    <div class="flex gap-4">
      <n-form-item :label="t('form.quantity')" path="quantity" class="flex-1">
        <n-input-number v-model:value="formData.quantity" :min="0" :step="1" class="w-full" />
      </n-form-item>

      <n-form-item :label="t('form.unitPrice')" path="unitPrice" class="flex-1">
        <n-input-number
          v-model:value="formData.unitPrice"
          :min="0"
          :step="100"
          :placeholder="String(formData.unitPrice)"
          :show-button="false"
          class="w-full"
        />
      </n-form-item>
    </div>

    <div class="mb-4 p-3 bg-blue-50 rounded flex justify-center">
      <div class="text-lg font-bold text-blue">
        {{ t('form.totalPrice') }}: {{ totalPrice.toLocaleString('cs-CZ') }} Kč
      </div>
    </div>

    <n-form-item :label="t('form.name')" path="name">
      <n-input v-model:value="formData.name" :placeholder="t('form.namePlaceholder')" />
    </n-form-item>
  </div>
</template>
