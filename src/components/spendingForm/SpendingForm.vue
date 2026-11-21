<script setup lang="ts">
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { type FormInst, NDrawer, NDrawerContent, NForm, useMessage } from 'naive-ui'

  import { computed, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import FormActions from '@/components/shared/FormActions.vue'
  import FormAdditionalFields from '@/components/spendingForm/components/SpendingFormAdditionalFields.vue'
  import FormBasicFields from '@/components/spendingForm/components/SpendingFormBasicFields.vue'
  import FormDocuments from '@/components/spendingForm/components/SpendingFormDocuments.vue'
  import { useSpendingDialogAction } from '@/composables/spending/useSpendingDialogAction'
  import { useSpendingFormData } from '@/composables/spending/useSpendingFormData'
  import { useSpendingFormOptions } from '@/composables/spending/useSpendingFormOptions'
  import { useSpendingFormValidation } from '@/composables/spending/useSpendingFormValidation'
  import { useAppNavigation } from '@/composables/useAppNavigation'
  import { formatDateLocalized } from '@/composables/useDateFormat'
  import { useFileHandler } from '@/composables/useFileHandler'
  import { SpendingDocument } from '@/types/SpendingDocument'

  const { deleteDialog } = useSpendingDialogAction()
  const { t } = useI18n()
  const store = useSpendingsStore()
  const formRef = ref<FormInst | null>(null)
  const { closeOverlay } = useAppNavigation()
  const message = useMessage()

  // File upload functionality
  const { uploadFile, deleteFile } = useFileHandler()

  const documentsToUpload = ref<SpendingDocument[]>([])
  const documentsToDelete = ref<SpendingDocument[]>([])

  const drawerTitle = computed(() =>
    isEditMode.value ? t('form.editPurchase') : t('form.newPurchase'),
  )

  const { formData, currentSpending, isEditMode } = useSpendingFormData()
  const { rules } = useSpendingFormValidation()
  const {
    categoryOptions,
    subCategoryOptions,
    payerOptions,
    tableGroupOptions,
    storeOptions,
    tagOptions,
  } = useSpendingFormOptions(computed(() => formData.value))

  const isOpen = ref(false)
  onMounted(() => (isOpen.value = true))

  function closeDrawer(): void {
    closeOverlay()
  }

  const uploadAllPendingDocuments = async (): Promise<void> => {
    await Promise.all(
      documentsToUpload.value.map(async (document) => {
        const copyName = crypto.randomUUID()
        const copySuccess = await uploadFile(document, copyName)
        if (copySuccess)
          // Update document path to the copied name and remove File object before saving
          formData.value.documents.push({
            name: document.name,
            extension: document.extension,
            path: `${copyName}.${document.extension}`,
          })
      }),
    )
    documentsToUpload.value = []
  }

  const deleteAllPendingDocuments = async (): Promise<void> => {
    await Promise.all(
      documentsToDelete.value.map(async (document) => {
        await deleteFile(document)
      }),
    )
    documentsToDelete.value = []
  }

  async function handleSave(): Promise<void> {
    try {
      await formRef.value?.validate()
    } catch (error) {
      console.error('Spending field validation failed', error)
      message.error(t('messages.errorRequiredData'))
      return
    }

    try {
      // Upload files if any are pending
      await uploadAllPendingDocuments()

      // Delete files if any are pending. No need to wait
      void deleteAllPendingDocuments()

      // Update existing
      if (isEditMode.value && currentSpending.value) {
        const updatedSpending = {
          ...formData.value,
          editedAt: new Date(),
        }

        store.updateSpending(currentSpending.value.id, updatedSpending)
        message.success(t('messages.purchaseEditedSuccessfully'))
      } else {
        // Create new
        store.addSpending(formData.value)
        message.success(t('messages.purchaseCreatedSuccessfully'))
      }

      closeDrawer()
    } catch (error) {
      console.error('Error while saving spending', error)
      message.error(t('messages.errorSavingPurchase'))
    }
  }

  async function handleDelete(): Promise<void> {
    if (!currentSpending.value) return
    await deleteDialog(currentSpending.value, null, closeDrawer)
  }
</script>

<template>
  <n-drawer :show="isOpen" width="min(1240px, 94vw)" placement="right" @update:show="closeDrawer">
    <n-drawer-content :title="drawerTitle" closable>
      <template #header>
        <div class="text-xl font-semibold text-fg">
          {{ drawerTitle }}
        </div>
      </template>
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="top"
        require-mark-placement="right-hanging"
      >
        <div v-if="currentSpending" class="-mt-2 mb-4 flex justify-end text-xs text-fg-subtle">
          {{ t('form.edited') }}:
          <span class="ms-1 text-fg-muted">
            {{
              currentSpending.editedAt
                ? formatDateLocalized(currentSpending.editedAt, 'long')
                : t('common.never')
            }}
          </span>
        </div>

        <div class="flex flex-col gap-x-10 lg:flex-row">
          <FormBasicFields
            v-model:form-data="formData"
            :category-options="categoryOptions"
            :sub-category-options="subCategoryOptions"
            :payer-options="payerOptions"
            :store-options="storeOptions"
            :is-edit-mode="isEditMode"
          />
          <FormAdditionalFields
            v-model:form-data="formData"
            :table-group-options="tableGroupOptions"
            :tag-options="tagOptions"
          />
        </div>

        <FormDocuments
          v-model:documents="formData.documents"
          v-model:documents-to-upload="documentsToUpload"
          v-model:documents-to-delete="documentsToDelete"
        />
      </n-form>

      <template #footer>
        <FormActions
          show-delete
          :save-text="isEditMode ? t('form.saveChangesButton') : t('form.createPurchaseButton')"
          @save="handleSave"
          @delete="handleDelete"
          @cancel="closeDrawer"
        />
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
