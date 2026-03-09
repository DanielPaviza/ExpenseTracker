<script setup lang="ts">
  import Tooltip from '@components/shared/Tooltip.vue'
  import FormUrlInput from '@components/spendingForm/components/SpendingFormUrlInput.vue'
  import { NCheckbox, NFormItem, NInput, NSelect, type SelectOption } from 'naive-ui'

  import { useI18n } from 'vue-i18n'

  import type { Spending } from '@/types/Spending'

  const { tableGroupOptions, tagOptions } = defineProps<{
    tableGroupOptions: SelectOption[]
    tagOptions: SelectOption[]
  }>()

  const { t } = useI18n()
  const formData = defineModel<Spending>('formData', { required: true })

  const handleSetTableGroup = (value: string | null): void => {
    formData.value.tableGroup = value
    // If the tags are empty, add the selected tableGroup as a tag
    if (formData.value.tags.length <= 0 && value) formData.value.tags.push(value)
  }
</script>

<template>
  <div class="flex-1">
    <n-form-item path="tableGroup">
      <template #label>
        <div class="flex items-center gap-1">
          {{ t('form.group') }}
          <Tooltip :text="t('form.groupTooltip')" small />
        </div>
      </template>
      <n-select
        :value="formData.tableGroup"
        :options="tableGroupOptions"
        :placeholder="t('form.selectGroup')"
        filterable
        tag
        clearable
        @update:value="handleSetTableGroup"
      />
    </n-form-item>

    <n-form-item :label="t('form.tags')" path="tags">
      <n-select
        v-model:value="formData.tags"
        :options="tagOptions"
        :placeholder="t('form.selectTags')"
        filterable
        multiple
        tag
        clearable
      />
    </n-form-item>

    <n-form-item :label="t('form.storeCode')" path="storeCode">
      <n-input
        v-model:value="formData.storeCode"
        :placeholder="t('form.storeCodePlaceholder')"
        clearable
      />
    </n-form-item>

    <n-form-item :label="t('form.dimensions')" path="dimensions">
      <n-input
        v-model:value="formData.dimensions"
        :placeholder="t('form.dimensionsPlaceholder')"
        clearable
      />
    </n-form-item>

    <FormUrlInput v-model:url="formData.url!" :label="t('form.url')" />

    <FormUrlInput
      v-model:url="formData.technicalDocumentUrl!"
      :label="t('form.technicalDocument')"
    />

    <n-form-item :label="t('form.description')" path="description">
      <n-input
        v-model:value="formData.description"
        type="textarea"
        :placeholder="t('form.descriptionPlaceholder')"
        :rows="4"
        clearable
      />
    </n-form-item>

    <div class="flex justify-center">
      <div class="flex gap-20">
        <n-form-item :label="t('form.toBePaid')">
          <template #label>
            <div class="flex items-center gap-1">
              {{ t('form.toBePaid') }}
              <Tooltip :text="t('form.toBePaidTooltip')" />
            </div>
          </template>
          <n-checkbox v-model:checked="formData.isToBePaid">
            {{ formData.isToBePaid ? t('common.yes') : t('common.no') }}
          </n-checkbox>
        </n-form-item>

        <n-form-item :label="t('form.free')">
          <template #label>
            <div class="flex items-center gap-1">
              {{ t('form.free') }}
              <Tooltip :text="t('form.freeTooltip')" />
            </div>
          </template>
          <n-checkbox v-model:checked="formData.isFree">
            {{ formData.isFree ? t('common.yes') : t('common.no') }}
          </n-checkbox>
        </n-form-item>
      </div>
    </div>
  </div>
</template>
