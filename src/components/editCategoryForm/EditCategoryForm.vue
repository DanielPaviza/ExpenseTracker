<script setup lang="ts">
  import { ArrowForward } from '@vicons/ionicons5'
  import {
    NDrawer,
    NDrawerContent,
    NForm,
    NFormItem,
    NIcon,
    NInput,
    useDialog,
    useMessage,
  } from 'naive-ui'

  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'

  import FormActions from '@/components/shared/FormActions.vue'
  import Tooltip from '@/components/shared/Tooltip.vue'
  import { useSpendingsStore } from '@/stores/spendingsStore'

  const { t } = useI18n()
  const router = useRouter()
  const message = useMessage()
  const dialog = useDialog()
  const route = useRoute()
  const { removeSpendingCategory, renameSpendingCategory } = useSpendingsStore()

  const categoryName = route.params.name as string
  const newCategoryName = ref<string>(categoryName)
  const showOldName = computed(() => newCategoryName.value !== categoryName)

  const deleteDialog = async (): Promise<void> => {
    dialog.error({
      title: t('dialogs.deleteCategoryTitle'),
      content: t('dialogs.deleteCategoryContent', { name: categoryName }),
      positiveText: t('dialogs.delete'),
      negativeText: t('common.cancel'),
      onPositiveClick: async () => {
        removeSpendingCategory(categoryName)
        closeDrawer()
        message.success(t('dialogs.deleteCategorySuccess', { name: categoryName }))
      },
    })
  }

  function closeDrawer(): void {
    router.push('/')
  }

  async function handleSave(): Promise<void> {
    try {
      renameSpendingCategory(categoryName, newCategoryName.value)
      message.success(t('editCategoryForm.categoryNameChangeSuccess'))
      closeDrawer()
    } catch (error) {
      console.error('Error while saving spending', error)
      message.error(t('editCategoryForm.categoryNameChangeError'))
    }
  }
</script>

<template>
  <n-drawer show width="40%" placement="right" @update:show="closeDrawer">
    <n-drawer-content closable class="p-4">
      <template #header>
        <div class="text-2xl font-bold text-blue">
          {{ $t('editCategoryForm.title') }}
        </div>
      </template>
      <n-form label-placement="top" require-mark-placement="right-hanging">
        <n-form-item path="name">
          <template #label>
            <div class="flex items-center">
              <span>{{ t('editCategoryForm.name') }}</span>
              <div class="ms-2"><tooltip :text="t('editCategoryForm.editNameTooltip')" /></div>
            </div>
          </template>
          <n-input v-model:value="newCategoryName" :placeholder="t('editCategoryForm.name')" />
        </n-form-item>
        <div v-if="showOldName">
          <div class="text-lg font-semibold">{{ $t('editCategoryForm.renamingCategory') }}</div>
          <div
            class="text-lg flex justify-center items-center border p-3 rounded border-orange-400 bg-orange-100 text-orange-800 mt-1"
          >
            {{ categoryName }}
            <n-icon size="20" class="mx-3 mt-0.5">
              <ArrowForward />
            </n-icon>
            <strong>{{ newCategoryName }}</strong>
          </div>
        </div>
      </n-form>

      <template #footer>
        <FormActions
          @save="handleSave"
          @delete="deleteDialog"
          @cancel="closeDrawer"
          showDelete
          :saveText="t('form.saveChangesButton')"
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
