<script setup lang="ts">
  import Tooltip from '@components/shared/Tooltip.vue'
  import FormUrlInput from '@components/spendingForm/components/SpendingFormUrlInput.vue'
  import { NCheckbox, NFormItem, NInput, NSelect, type SelectOption } from 'naive-ui'

  import { useI18n } from 'vue-i18n'

  import type { Spending } from '@/types/Spending'

  const { subCategoryOptions, tagOptions } = defineProps<{
    subCategoryOptions: SelectOption[]
    tagOptions: SelectOption[]
  }>()

  const { t } = useI18n()
  const formData = defineModel<Spending>('formData', { required: true })

  const handleSetSubcategory = (value: string | null): void => {
    formData.value.subCategory = value
    // If the tags are empty, add the selected subcategory as a tag
    if (formData.value.tags.length <= 0 && value) {
      formData.value.tags.push(value)
    }
  }
</script>

<template>
  <div class="flex-1">
    <n-form-item path="subCategory">
      <template #label>
        <div class="flex items-center gap-1">
          {{ t('form.group') }}
          <Tooltip :text="t('form.groupTooltip')" />
        </div>
      </template>
      <n-select
        @update:value="handleSetSubcategory"
        :value="formData.subCategory"
        :options="subCategoryOptions"
        :placeholder="t('form.selectGroup')"
        filterable
        tag
        clearable
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

    <FormUrlInput :label="t('form.url')" v-model:url="formData.url!" />

    <FormUrlInput
      :label="t('form.technicalDocument')"
      v-model:url="formData.technicalDocumentUrl!"
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
