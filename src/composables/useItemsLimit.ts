import { computed, ref, type ComputedRef, type Ref } from 'vue'

export function useItemsLimit<T>(
    items: ComputedRef<T[]> | Ref<T[]>,
    maxItems: number = 8,
) {
    const showAll = ref(false)

    const displayedItems = computed(() => {
        return showAll.value ? items.value : items.value.slice(0, maxItems)
    })

    const hasMore = computed(() => items.value.length > maxItems)

    const toggleText = computed(() => {
        return showAll.value
            ? '▲ Zobrazit méně'
            : `▼ Zobrazit všechny (${items.value.length})`
    })

    return {
        displayedItems,
        showAll,
        hasMore,
        toggleText,
    }
}
