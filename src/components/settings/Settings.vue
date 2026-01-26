<script setup lang="ts">
  import { useSettingsStore } from '@stores/settingsStore'
  import { useMessage } from 'naive-ui'
  import { NDrawer, NDrawerContent, NForm, NFormItem, NSelect } from 'naive-ui'

  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  import FormActions from '@/components/settings/components/SettingsFormActions.vue'
  import SelectBool from '@/components/shared/SelectBool.vue'
  import tooltip from '@/components/shared/Tooltip.vue'
  import { useSettingsFormValidation } from '@/composables/useSettingsFormValidation'
  import { CURRENCY_SYMBOL_PRESETS } from '@/constants/currency'
  import { DEFAULT_SETTINGS } from '@/constants/defaultSettings'
  import { LANGUAGES } from '@/constants/languages'
  import { SUMMARY_CARDS } from '@/constants/summaryCards'
  import { Settings } from '@/types/Settings'

  const { t } = useI18n()
  const { settings, save: saveSettings } = useSettingsStore()
  const tempSettings = ref<Settings>({ ...settings })

  const router = useRouter()
  const message = useMessage()
  const { rules } = useSettingsFormValidation()

  function closeDrawer(): void {
    router.push('/')
  }

  const handleSave = async (): Promise<void> => {
    const success = await saveSettings(tempSettings.value)
    if (success) {
      message.success(t('messages.changesSavedSuccessfully'))
      closeDrawer()
    } else {
      message.error(t('messages.errorSavingChanges'))
    }
  }

  const handleReset = (): void => {
    tempSettings.value = { ...DEFAULT_SETTINGS }
  }
</script>

<template>
  <n-drawer show width="40%" placement="right" @update:show="closeDrawer">
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
              <span>{{ t('settings.subGroupDefaultState') }}</span>
              <div class="ms-2"><tooltip :text="t('settings.subGroupDefaultStateTooltip')" /></div>
            </div>
          </template>
          <SelectBool v-model:value="tempSettings.subGroupDefaultOpen" />
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
      </n-form>

      <template #footer>
        <FormActions @save="handleSave" @cancel="closeDrawer" @reset="handleReset" />
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
