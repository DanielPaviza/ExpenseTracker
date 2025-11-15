<script setup lang="ts">
 import { ref } from "vue";
 import { invoke } from "@tauri-apps/api/core";
 import { Spending } from "./models/Spending";
 import SpendingsDashboard from "./components/SpendingsDashboard.vue";

 const spendings = ref<Spending[]>([]);
 void load_data();

async function save_data(spendings: Spending[]) {
  const payload = JSON.stringify(spendings);
  await invoke("save_data", { jsonData: payload } );
}
  
async function load_data() {

}
</script>

<template>
    <SpendingsDashboard :spendings="spendings" />
    <button @click="save_data(spendings)">Save</button>
</template>
