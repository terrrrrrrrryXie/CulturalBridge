<template>
    <PageTopicComp :page="4" />
    <div class="container">
        <DataTable v-model:filters="filters" v-model:editingRows="editingRows" v-model:selection="selectedUser" :value="allUsers" paginator removableSort showGridlines :rows="10" dataKey="email"
                filterDisplay="menu" :loading="loading" :globalFilterFields="['email', 'booked', 'ratedEvent', 'role']"
                editMode="row" @row-edit-save="onRowEditSave" selectionMode="single" :metaKeySelection="metaKey">
            <template #header>
                <div>Total number of users: {{ allUsers.length }}</div>
                <div class="flex justify-between filterBar">
                <button class="save btn btn-primary" @click="saveChanges" v-if="isEdited">Save</button>
                <button class="save btn btn-danger" @click="deleteUser" v-if="showDelete">Delete</button>
                <button class="clear btn btn-outline-success" @click="initFilters">Clear</button>
                <input class="search form-control" type="text" v-model="filters['global'].value" placeholder="Keyword Search">
                </div>
            </template>
            <div class="warning" v-if="isWarning">Your can't modify information of admin</div>
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column field="email" header="Email" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.email }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by email" />
                </template>
            </Column>
            <Column field="booked" header="Number of Booked Events" filterField="booked" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    {{ data.booked }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Enter a number" />
                </template>
            </Column>
            <Column field="ratedEvent" header="Number of Rated Events" filterField="ratedEvent" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    {{ data.ratedEvent }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Enter a number" />
                </template>
            </Column>
            <Column header="Role" filterField="role" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                <template #editor="{ data }">
                    <Select v-model="data.role" :options="roles" placeholder="Select a Role" fluid>
                        <template #option="slotProps">
                            <i :class="['bi', slotProps.option === 'user' ? 'bi-person' : 'bi-command']" style="margin-right: 0.2vw" />
                            <span>{{ slotProps.option }}</span>
                        </template>
                    </Select>
                </template>
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.role }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="roles" placeholder="Any">
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <i :class="['bi', slotProps.option === 'user'?'bi-person':'bi-command']" style="margin-right: 0.2vw" />
                                <span>{{ slotProps.option }}</span>
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Column>
            <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center" class="ss">
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import PageTopicComp from '@/components/PageTopicComp.vue'
import Select from 'primevue/select';

const store = useStore()

const roles = ref([
    'user',
    'admin'
]);

const editingRows = ref([]);
const allUsers = ref([])
const selectedUser = ref()
const metaKey = ref(true);
const isEdited = ref(false)
const isWarning = ref(false)
const showDelete = ref(false)

onMounted(async () => {
  allUsers.value = await store.dispatch('getAllUsers')
  allUsers.value = allUsers.value.map((user) => ({
    ...user,
    booked: user.booked.length,
    ratedEvent: Object.keys(user.ratedEvent).length
  }));
  loading.value = false;
})

const filters = ref({});
const loading = ref(true);

const initFilters = () => {
  // filter rules
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    booked: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    ratedEvent: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    role: { value: null, matchMode: FilterMatchMode.IN }
  };
};

initFilters();

// show save button when modify local table
const onRowEditSave = (event) => {
  let { newData, index } = event;
  isEdited.value = true
  
  allUsers.value[index] = newData
}

// disable modify admin role
watch(editingRows, (newValue, old) => {
  if (newValue.length !== 0 && newValue[0].role === 'admin') {    
    isWarning.value = true
    editingRows.value = old
  }
})

// control whether show delete button
watch(selectedUser, (newValue) => {
  if (newValue !== null && newValue.role === 'admin') {
    isWarning.value = true
    newValue = null
  }
  
  showDelete.value = !(newValue === null)
})

const deleteUser = () => {
  allUsers.value = allUsers.value.filter(user => user.email !== selectedUser.value.email)
  isEdited.value = true
}

const saveChanges = async () => {
  const response = await store.dispatch('updateUsers', { newDoc: allUsers.value })
  if (response) {
    isEdited.value = false
    isWarning.value = false
    showDelete.value = false
  }
}
</script>

<style scoped>
.filterBar {
	width: 100%;
	/* border: 2px red solid; */
	flex-direction: row;
	display: flex;
	justify-content: flex-end;
}
.search {
	width: 20%;
	margin-left: 2vw;
}
.save {
  margin-right: 2vw;
}
.warning {
  color: red;
}
</style>