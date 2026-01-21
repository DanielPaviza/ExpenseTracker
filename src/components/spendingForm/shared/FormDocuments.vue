<script setup lang="ts">
  import { AddOutline, DocumentOutline } from '@vicons/ionicons5'
  import { NButton, NIcon } from 'naive-ui'

  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import FormDocumentCard from '@/components/spendingForm/shared/FormDocumentCard.vue'
  import { useDocumentsDragDrop } from '@/composables/useDocumentsDragDrop'
  import { useFileUpload } from '@/composables/useFileUpload'
  import { SpendingDocument } from '@/types/SpendingDocument'

  const { convertDocumentPath } = useFileUpload()

  const documents = defineModel<SpendingDocument[]>('documents', { required: true })

  const documentsToUpload = defineModel<SpendingDocument[]>('documentsToUpload', {
    default: [],
  })
  const documentsToDelete = defineModel<SpendingDocument[]>('documentsToDelete', {
    default: [],
  })

  const { t } = useI18n()
  const fileInputRef = ref<HTMLInputElement | null>(null)

  const documentsEmpty = computed(
    () => documents.value.length + documentsToUpload.value.length === 0,
  )

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
    class="drop-zone p-4 rounded-lg border-dashed border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer"
    :class="{ 'drop-zone-active': isDragging }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @click="openFilePicker"
  >
    <div class="flex items-center justify-between mb-3">
      <span class="text-lg font-medium text-gray-700">{{ t('form.documents') }}</span>
      <NButton size="small" type="primary" @click.stop="openFilePicker">
        <template #icon>
          <NIcon>
            <AddOutline />
          </NIcon>
        </template>
        {{ t('form.addDocument') }}
      </NButton>
    </div>

    <div v-if="documentsEmpty" class="flex flex-col items-center justify-center p-6">
      <NIcon size="48" :component="DocumentOutline" class="text-gray-400 mb-2" />
      <p class="text-gray-500 text-sm">{{ t('form.documentsDropZone') }}</p>
    </div>

    <div v-else class="flex gap-4 flex-wrap">
      <FormDocumentCard
        v-for="(_doc, index) in documents"
        :key="`document-${index}`"
        v-model="documents[index]"
        @deleteDocument="deleteDocument(index)"
        :document-path="convertDocumentPath(documents[index].path)"
      />
      <FormDocumentCard
        v-for="(_doc, index) in documentsToUpload"
        :key="`new-document-${index}`"
        v-model="documentsToUpload[index]"
        @deleteDocument="deleteNewDocument(index)"
        :document-path="documentsToUpload[index].path"
      />
    </div>
  </div>
</template>

<style scoped>
  .drop-zone {
    transition: all 0.3s ease;
  }

  .drop-zone-active {
    border-color: #3b82f6;
    background-color: #eff6ff;
  }
</style>
