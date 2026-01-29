<script setup lang="ts">
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { type FormInst, NDrawer, NDrawerContent, NForm, useMessage } from 'naive-ui'

  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  import FormActions from '@/components/spendingForm/components/SpendingFormActions.vue'
  import FormAdditionalFields from '@/components/spendingForm/components/SpendingFormAdditionalFields.vue'
  import FormBasicFields from '@/components/spendingForm/components/SpendingFormBasicFields.vue'
  import FormDocuments from '@/components/spendingForm/components/SpendingFormDocuments.vue'
  import FormTimestamps from '@/components/spendingForm/components/SpendingFormTimestamps.vue'
  import { useFileUpload } from '@/composables/useFileUpload'
  import { useSpendingDialogAction } from '@/composables/useSpendingDialogAction'
  import { useSpendingFormData } from '@/composables/useSpendingFormData'
  import { useSpendingFormOptions } from '@/composables/useSpendingFormOptions'
  import { useSpendingFormValidation } from '@/composables/useSpendingFormValidation'
  import { SpendingDocument } from '@/types/SpendingDocument'

  const { deleteDialog } = useSpendingDialogAction()
  const { t } = useI18n()
  const store = useSpendingsStore()
  const formRef = ref<FormInst | null>(null)
  const router = useRouter()
  const message = useMessage()

  // File upload functionality
  const { uploadFile, deleteFile } = useFileUpload()

  const documentsToUpload = ref<SpendingDocument[]>([])
  const documentsToDelete = ref<SpendingDocument[]>([])

  const drawerTitle = computed(() =>
    isEditMode.value ? t('form.editPurchase') : t('form.newPurchase'),
  )

  const { formData, currentSpending, isEditMode } = useSpendingFormData()
  const { rules } = useSpendingFormValidation()
  const { categoryOptions, payerOptions, tableGroupOptions, storeOptions, tagOptions } =
    useSpendingFormOptions(computed(() => formData.value))

  function closeDrawer(): void {
    router.push('/')
  }

  const uploadAllPendingDocuments = async (): Promise<void> => {
    await Promise.all(
      documentsToUpload.value.map(async (document) => {
        const copyName = crypto.randomUUID()
        const copySuccess = await uploadFile(document, copyName)
        if (copySuccess) {
          // Update document path to the copied name and remove File object before saving
          formData.value.documents.push({
            name: document.name,
            extension: document.extension,
            path: `${copyName}.${document.extension}`,
          })
        }
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

        await store.updateSpending(currentSpending.value.id, updatedSpending)
        message.success(t('messages.purchaseEditedSuccessfully'))
      } else {
        // Create new
        await store.addSpending(formData.value)
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
  <n-drawer show width="80%" placement="right" @update:show="closeDrawer">
    <n-drawer-content :title="drawerTitle" closable class="p-4">
      <template #header>
        <div class="text-2xl font-bold text-blue">
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
        <FormTimestamps v-if="currentSpending" :spending="currentSpending" />

        <div class="flex gap-10">
          <FormBasicFields
            v-model:form-data="formData"
            :category-options="categoryOptions"
            :payer-options="payerOptions"
            :store-options="storeOptions"
            :is-edit-mode="isEditMode"
          />
          <FormAdditionalFields
            v-model:form-data="formData"
            :sub-category-options="tableGroupOptions"
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
          :is-edit-mode="isEditMode"
          @save="handleSave"
          @delete="handleDelete"
          @cancel="closeDrawer"
      /></template>
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
