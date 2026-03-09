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

  import ButtonNavigation from '@/components/shared/ButtonNavigation.vue'
  import FormActions from '@/components/shared/FormActions.vue'
  import Tooltip from '@/components/shared/Tooltip.vue'
  import { useSpendingsStore } from '@/stores/spendingsStore'
  import { BulkEditProps } from '@/types/BulkEditProps'

  const { t } = useI18n()
  const router = useRouter()
  const message = useMessage()
  const dialog = useDialog()
  const route = useRoute()
  const { categoryView } = useSpendingsStore()

  const { props } = defineProps<{
    props: BulkEditProps
  }>()

  const name = route.params.name as string
  const newName = ref<string>(name)
  const isNameEdited = computed(() => newName.value !== name)

  // Best-practice: single source of truth for scope choices
  const scopeChoices = computed(() => [
    {
      id: 'current-category',
      label: t('spendingBulkEditForm.currentCategory', { name: categoryView }),
    },
    {
      id: 'all-categories',
      label: t('spendingBulkEditForm.allCategories'),
    },
  ])

  const selectedScope = ref<string>('current-category')
  const isAllCategories = computed(() => selectedScope.value === 'all-categories')

  const deleteDialog = async (): Promise<void> => {
    dialog.error({
      title: props.deleteDialogTitle,
      content: props.deleteDialogContentText,
      positiveText: t('dialogs.delete'),
      negativeText: t('common.cancel'),
      onPositiveClick: async () => {
        props.removeSpendingBulk(isAllCategories.value)
        closeDrawer()
        message.success(props.deleteDialogSuccessMessage)
      },
    })
  }

  function closeDrawer(): void {
    router.push('/')
  }

  async function handleSave(): Promise<void> {
    if (!isNameEdited.value) {
      closeDrawer()
      return
    }
    try {
      props.renameSpendingProperty(newName.value, isAllCategories.value)
      message.success(props.renameSuccessText)
      closeDrawer()
    } catch (error) {
      console.error('Error while saving spending property rename', error)
      message.error(props.renameErrorText)
    }
  }
</script>

<template>
  <n-drawer show width="40%" placement="right" @update:show="closeDrawer">
    <n-drawer-content closable class="p-4">
      <template #header>
        <div class="text-2xl font-bold text-blue">
          {{ props.title }}
        </div>
      </template>
      <n-form label-placement="top" require-mark-placement="right-hanging">
        <n-form-item path="scope" v-if="props.canSelectScope">
          <template #label>
            <div class="flex items-center">
              <span>{{ $t('spendingBulkEditForm.scopeLabel') }}</span>
              <div class="ms-2">
                <tooltip :text="$t('spendingBulkEditForm.scopeInputTooltip')" />
              </div>
            </div>
          </template>
          <div class="flex justify-center w-full">
            <ButtonNavigation full :buttons="scopeChoices" v-model:selectedId="selectedScope" />
          </div>
        </n-form-item>
        <n-form-item path="name">
          <template #label>
            <div class="flex items-center">
              <span>{{ props.nameLabel }}</span>
              <div class="ms-2">
                <tooltip :text="props.nameInputTooltip" />
              </div>
            </div>
          </template>
          <n-input v-model:value="newName" :placeholder="props.nameLabel" />
        </n-form-item>
        <div v-if="isNameEdited">
          <div class="text-lg font-semibold">{{ $t('common.rename') }}</div>
          <div
            class="text-lg flex justify-center items-center p-3 rounded bg-blue-50 text-blue-800 mt-1"
          >
            {{ name }}
            <n-icon size="20" class="mx-3 mt-0.5">
              <ArrowForward />
            </n-icon>
            <strong>{{ newName }}</strong>
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
