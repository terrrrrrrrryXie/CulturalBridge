<template>
	<PageTopicComp :page="3" />
	<div class="container">
        <DataTable v-model:filters="filters" :value="immiStories" paginator showGridlines :rows="10" dataKey="id"
                filterDisplay="menu" :loading="loading" :globalFilterFields="['author', 'title', 'date', 'content']">
            <template #header>
				
                <div class="flex justify-between">
					<button @click="clearFilter()">clear</button>
					<input type="text" v-model="filters['global'].value" placeholder="Keyword Search">
                </div>
            </template>
            <template #empty> No stories found. </template>
            <template #loading> Loading stories data...please wait. </template>
            <Column field="author" header="Author" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.author }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
                </template>
            </Column>
            <Column field="title" header="Title" filterField="title" style="min-width: 12rem">
                <template #body="{ data }">
					{{ data.title }}
				</template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by title" />
                </template>
            </Column>
            <Column header="Date" filterField="published_date" dataType="date" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ formatDate(data.published_date) }}
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                </template>
            </Column>
            <Column header="content" filterField="content" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.content }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by name" class="!p-8" />
                </template>
            </Column>
        </DataTable>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/calendar';
import PageTopicComp from '@/components/PageTopicComp.vue'

const store = useStore();

const immiStories = ref([]);

const filters = ref({});
const loading = ref(true);

const initFilters = () => {
  // filter rules
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    author: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    published_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    content: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
  };
};

const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
	});
}

const clearFilter = () => {
  initFilters();
};

onMounted(async () => {
  await store.dispatch('getImmiStoriesList');
  immiStories.value = store.state.immiStories.map((story) => ({
    ...story,
    published_date: new Date(story.published_date)
  }));
  loading.value = false;  
});

initFilters();
</script>
