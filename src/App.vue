<script setup lang="ts">
  import Header from '@components/Header.vue'
  import Loading from '@components/Loading.vue'
  import MarginContainer from '@components/MarginContainer.vue'
  import SpendingsDashboard from '@components/SpendingsDashboard/Dashboard.vue'
  import SpendingsList from '@components/spendingsList/SpendingsList.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { NConfigProvider } from 'naive-ui'

  import { onMounted } from 'vue'

  const spendingsStore = useSpendingsStore()

  onMounted(async () => {
    await spendingsStore.load()
  })
</script>

<template>
  <NConfigProvider>
    <MarginContainer>
      <Header />
      <Loading v-if="spendingsStore.isLoading" />
      <template v-else>
        <SpendingsDashboard />
        <SpendingsList />
      </template>
    </MarginContainer>
  </NConfigProvider>
</template>
