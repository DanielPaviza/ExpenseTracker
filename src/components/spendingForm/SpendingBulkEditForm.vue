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

  import { computed, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'

  import ButtonNavigation from '@/components/shared/ButtonNavigation.vue'
  import FormActions from '@/components/shared/FormActions.vue'
  import Tooltip from '@/components/shared/Tooltip.vue'
  import { useAppNavigation } from '@/composables/useAppNavigation'
  import { useSpendingsStore } from '@/stores/spendingsStore'
  import { BulkEditProps } from '@/types/BulkEditProps'

  const { t } = useI18n()
  const { closeOverlay } = useAppNavigation()
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
  const isNameEmpty = computed(() => newName.value.trim() === '')
  const isNameValid = computed(() => props.canBeEmpty || !isNameEmpty.value)

  const newDisplayName = computed(() => (isNameEmpty.value ? t('table.unknown') : newName.value))

  // Best-practice: single source of truth for scope choices
  const scopeChoices = computed(() => [
    {
      id: 'current-category',
      label: t('spendingBulkEditForm.currentCategory', { name: categoryView }),
    },
    {
      id: 'all-categories',
      label: t('spendingBulkEditForm.allCategories'),
      selectedColor: 'orange',
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

  const isOpen = ref(false)
  onMounted(() => (isOpen.value = true))

  function closeDrawer(): void {
    closeOverlay()
  }

  async function handleSave(): Promise<void> {
    if (!isNameValid.value) {
      message.warning(t('messages.nameCannotBeEmpty'))
      return
    }

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
  <n-drawer :show="isOpen" width="min(560px, 94vw)" placement="right" @update:show="closeDrawer">
    <n-drawer-content closable>
      <template #header>
        <div class="text-xl font-semibold text-fg">
          {{ props.title }}
        </div>
      </template>
      <n-form label-placement="top" require-mark-placement="right-hanging">
        <n-form-item v-if="props.canSelectScope" path="scope">
          <template #label>
            <div class="flex items-center">
              <span>{{ $t('spendingBulkEditForm.scopeLabel') }}</span>
              <div class="ms-2">
                <tooltip :text="$t('spendingBulkEditForm.scopeInputTooltip')" />
              </div>
            </div>
          </template>
          <div class="flex justify-center w-full">
            <ButtonNavigation v-model:selected-id="selectedScope" full :buttons="scopeChoices" />
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
          <div class="flex flex-col w-full">
            <n-input v-model:value="newName" :placeholder="props.nameLabel" />
            <div v-if="!isNameValid" class="text-sm text-danger mt-1 ms-1">
              {{ $t('messages.nameCannotBeEmpty') }}
            </div>
          </div>
        </n-form-item>
        <div v-if="isNameEdited && isNameValid">
          <div class="text-lg font-semibold">{{ $t('common.rename') }}</div>
          <div
            class="text-lg flex justify-center items-center p-3 rounded bg-primary-soft text-primary mt-1"
          >
            {{ name }}
            <n-icon size="20" class="mx-3 mt-0.5">
              <ArrowForward />
            </n-icon>
            <strong>{{ newDisplayName }}</strong>
          </div>
        </div>
      </n-form>

      <template #footer>
        <FormActions
          show-delete
          :save-text="t('form.saveChangesButton')"
          :can-save="isNameValid"
          @save="handleSave"
          @delete="deleteDialog"
          @cancel="closeDrawer"
        />
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
