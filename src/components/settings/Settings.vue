<script setup lang="ts">
  import { useSettingsStore } from '@stores/settingsStore'
  import { useMessage } from 'naive-ui'
  import { NDrawer, NDrawerContent, NForm, NFormItem, NSelect } from 'naive-ui'

  import { computed, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  import FormActions from '@/components/shared/FormActions.vue'
  import SelectBool from '@/components/shared/SelectBool.vue'
  import SelectTextNull from '@/components/shared/SelectTextNull.vue'
  import tooltip from '@/components/shared/Tooltip.vue'
  import { useSpendingsColumns } from '@/composables/spending/useSpendingsColumns'
  import { useSettingsFormValidation } from '@/composables/useSettingsFormValidation'
  import { CURRENCY_SYMBOL_PRESETS } from '@/constants/currency'
  import { DEFAULT_SETTINGS } from '@/constants/defaultSettings'
  import { LANGUAGES } from '@/constants/languages'
  import { SUMMARY_CARDS } from '@/constants/summaryCards'
  import { useSpendingsStore } from '@/stores/spendingsStore'
  import { Settings } from '@/types/Settings'

  const { t } = useI18n()
  const { columns } = useSpendingsColumns()
  const { settings, save: saveSettings } = useSettingsStore()
  const { categories } = useSpendingsStore()
  const tempSettings = ref<Settings>({ ...settings })

  const router = useRouter()
  const message = useMessage()
  const { rules } = useSettingsFormValidation()

  const isOpen = ref(false)
  onMounted(() => (isOpen.value = true))

  function closeDrawer(): void {
    router.push('/')
  }

  const handleSave = async (): Promise<void> => {
    const success = await saveSettings(tempSettings.value)
    if (success) {
      message.success(t('messages.settingsSavedSuccessfully'))
      closeDrawer()
    } else message.error(t('messages.errorSavingSettings'))
  }

  const handleReset = (): void => {
    tempSettings.value = { ...DEFAULT_SETTINGS }
  }

  const isDefaultHiddenColumnsValid = computed(
    (): boolean => tempSettings.value.defaultHiddenSpendingColumns.length < columns.value.length,
  )
</script>

<template>
  <n-drawer :show="isOpen" width="40%" placement="right" @update:show="closeDrawer">
    <n-drawer-content closable class="p-4">
      <template #header>
        <div class="text-2xl font-bold text-blue">{{ t('settings.title') }}</div>
      </template>
      <n-form
        ref="formRef"
        :model="tempSettings"
        :rules="rules"
        label-placement="top"
        require-mark-placement="right-hanging"
      >
        <n-form-item :label="t('settings.language')" path="languageCode">
          <n-select
            v-model:value="tempSettings.languageCode"
            :options="LANGUAGES.map((lang) => ({ label: lang.name, value: lang.code }))"
          />
        </n-form-item>

        <n-form-item :label="t('settings.currencySymbol')" path="currencySymbol">
          <n-select
            v-model:value="tempSettings.currencySymbol"
            :options="CURRENCY_SYMBOL_PRESETS.map((symbol) => ({ label: symbol, value: symbol }))"
            filterable
            tag
          />
        </n-form-item>

        <n-form-item class="flex items-center">
          <template #label>
            <div class="flex items-center">
              <span>{{ t('settings.tableGroupDefaultState') }}</span>
              <div class="ms-2">
                <tooltip :text="t('settings.tableGroupDefaultStateTooltip')" />
              </div>
            </div>
          </template>
          <SelectBool v-model:value="tempSettings.tableGroupDefaultOpen" />
        </n-form-item>

        <n-form-item path="defaultSummaryCard">
          <template #label>
            <div class="flex items-center">
              <span>{{ t('settings.summaryCardDefault') }}</span>
              <div class="ms-2"><tooltip :text="t('settings.summaryCardDefaultTooltip')" /></div>
            </div>
          </template>
          <n-select
            v-model:value="tempSettings.defaultSummaryCard"
            :options="SUMMARY_CARDS.map((card) => ({ label: t(card.title), value: card.id }))"
          />
        </n-form-item>

        <n-form-item path="defaultCategoryView">
          <template #label>
            <div class="flex items-center">
              <span>{{ t('settings.categoryViewDefault') }}</span>
              <div class="ms-2"><tooltip :text="t('settings.categoryViewDefaultTooltip')" /></div>
            </div>
          </template>
          <SelectTextNull
            v-model:value="tempSettings.defaultCategoryView"
            :options="categories"
            :null-item-label="$t('common.allCategories')"
          />
        </n-form-item>

        <n-form-item path="defaultHiddenSpendingColumns">
          <template #label>
            <div class="flex items-center">
              <span>{{ t('settings.hiddenSpendingColumnsDefault') }}</span>
              <div class="ms-2">
                <tooltip :text="t('settings.hiddenSpendingColumnsDefaultTooltip')" />
              </div>
            </div>
          </template>
          <div class="flex flex-col w-full">
            <n-select
              v-model:value="tempSettings.defaultHiddenSpendingColumns"
              :options="columns.map((column) => ({ label: column.title, value: column.key }))"
              :placeholder="t('form.selectTags')"
              filterable
              multiple
              tag
              clearable
              :status="isDefaultHiddenColumnsValid ? 'success' : 'error'"
            />
            <div v-if="!isDefaultHiddenColumnsValid" class="text-red-500 text-sm mt-1">
              {{ t('settings.hiddenSpendingColumnsValidation') }}
            </div>
          </div>
        </n-form-item>
      </n-form>

      <template #footer>
        <FormActions
          show-reset
          :save-text="t('form.saveChangesButton')"
          :can-save="isDefaultHiddenColumnsValid"
          @save="handleSave"
          @cancel="closeDrawer"
          @reset="handleReset"
        />
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
<style scoped>
  :deep(.n-base-close.n-base-close--absolute.n-drawer-header__close) {
    color: #c04141;
    font-size: larger;
    padding: 10px;
  }
  :deep(.n-base-clear__clear) {
    color: #c62828 !important;
  }
  :deep(.n-base-clear__clear:hover) {
    color: red !important;
  }
</style>
