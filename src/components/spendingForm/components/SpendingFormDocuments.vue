<script setup lang="ts">
  import { AddOutline, DocumentAttachOutline } from '@vicons/ionicons5'
  import { NButton, NIcon } from 'naive-ui'

  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import FormDocumentCard from '@/components/spendingForm/components/SpendingFormDocumentCard.vue'
  import { useDocumentsDragDrop } from '@/composables/useDocumentsDragDrop'
  import { useFileHandler } from '@/composables/useFileHandler'
  import { SpendingDocument } from '@/types/SpendingDocument'

  const { convertDocumentPath } = useFileHandler()

  const documents = defineModel<SpendingDocument[]>('documents', { required: true })

  const documentsToUpload = defineModel<SpendingDocument[]>('documentsToUpload', {
    default: () => [],
  })
  const documentsToDelete = defineModel<SpendingDocument[]>('documentsToDelete', {
    default: () => [],
  })

  const { t } = useI18n()
  const fileInputRef = ref<HTMLInputElement | null>(null)

  // Drag and drop functionality
  const { isDragging, handleDragOver, handleDragLeave, handleDrop, handleFileSelect } =
    useDocumentsDragDrop(documentsToUpload)

  // Trigger file input click
  function openFilePicker(event?: Event): void {
    event?.stopPropagation()
    fileInputRef.value?.click()
  }

  const deleteDocument = (index: number): void => {
    documentsToDelete.value.push(documents.value[index])
    documents.value.splice(index, 1)
  }

  const deleteNewDocument = (index: number): void => {
    documentsToUpload.value.splice(index, 1)
  }
</script>

<template>
  <!-- Hidden file input -->
  <input
    ref="fileInputRef"
    type="file"
    multiple
    accept="*/*"
    class="hidden"
    @change="handleFileSelect"
  />
  <div
    class="drop-zone rounded-xl border-2 border-dashed border-line bg-surface-2/50 p-6"
    :class="{ 'drop-zone-active': isDragging }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div class="flex items-center justify-between mb-5">
      <span class="text-base font-semibold text-fg">{{ t('form.documents') }}</span>
      <NButton size="small" type="primary" secondary @click.stop="openFilePicker">
        <template #icon>
          <NIcon>
            <AddOutline />
          </NIcon>
        </template>
      </NButton>
    </div>

    <div class="flex gap-4 flex-wrap">
      <FormDocumentCard
        v-for="(_doc, index) in documents"
        :key="`document-${index}`"
        v-model="documents[index]"
        :document-path="convertDocumentPath(documents[index].path)"
        @delete-document="deleteDocument(index)"
      />
      <FormDocumentCard
        v-for="(_doc, index) in documentsToUpload"
        :key="`new-document-${index}`"
        v-model="documentsToUpload[index]"
        :document-path="documentsToUpload[index].path"
        @delete-document="deleteNewDocument(index)"
      />
      <div
        class="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-line-strong bg-surface p-8 transition hover:border-primary hover:bg-primary-soft"
        @click="openFilePicker"
      >
        <NIcon size="64" :component="DocumentAttachOutline" class="mb-2 text-fg-subtle" />
        <div class="text-sm font-semibold text-fg-muted">{{ t('form.addDocument') }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .drop-zone {
    transition: all 0.3s ease;
  }

  .drop-zone-active {
    border-color: var(--primary);
    background-color: var(--primary-soft);
  }
</style>
