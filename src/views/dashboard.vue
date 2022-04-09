<template>
    <div class="as-container">
        <div class="sidemenu">
            <img src="../assets/logo.png" class="as-logo"/>
            <select id="workspace" name="workspace">
                <option :value="user.personal_workspace.id">{{ user.personal_workspace.name }}</option>
            </select>
			<div v-if="active_workspace.active" class="as-separator"></div>
            <div v-if="active_workspace.active" class="workspaceSettings">
                <asButton v-if="view == 'dashboard'" bttnType="third" label="Dashboard" icon="dashboard-main-16.png" iconPosition="left" class="active"/>
                <asButton v-else bttnType="third" label="Dashboard" icon="dashboard-25gray-16.png" iconPosition="left"/>
                <asButton bttnType="third" label="Workspace Settings" icon="wrench-25gray-16.png" iconPosition="left"/>
                <asButton v-if="active_workspace.id != user.personal_workspace.id" bttnType="third" label="Leave Workspace" icon="logout-red-16.png" iconPosition="left"/>
            </div>
			<div class="as-separator"></div>
            <div class="menuItems">
                <p v-if="!active_workspace.active" class="setupText">More items will appear here after you finish the setup of this workspace.</p>
                <template v-else>
                    <asButton v-if="active_workspace.default_tables.default_tables_clients && view == 'table' && viewTable == 'clients'" bttnType="third" label="Clients" icon="table-main-16.png" iconPosition="left" class="active"/>
                    <asButton v-else-if="active_workspace.default_tables.default_tables_clients" bttnType="third" label="Clients" icon="table-25gray-16.png" iconPosition="left"/>
                    <asButton v-if="active_workspace.default_tables.default_tables_contracts && view == 'table' && viewTable == 'contracts'" bttnType="third" label="Contracts" icon="table-main-16.png" iconPosition="left" class="active"/>
                    <asButton v-else-if="active_workspace.default_tables.default_tables_contracts" bttnType="third" label="Contracts" icon="table-25gray-16.png" iconPosition="left"/>
                    <asButton v-if="active_workspace.default_tables.default_tables_invoices && view == 'table' && viewTable == 'invoices'" bttnType="third" label="Invoices" icon="table-main-16.png" iconPosition="left" class="active"/>
                    <asButton v-else-if="active_workspace.default_tables.default_tables_invoices" bttnType="third" label="Invoices" icon="table-25gray-16.png" iconPosition="left"/>
                    <asButton v-if="active_workspace.default_tables.default_tables_products && view == 'table' && viewTable == 'products'" bttnType="third" label="Products" icon="table-main-16.png" iconPosition="left" class="active"/>
                    <asButton v-else-if="active_workspace.default_tables.default_tables_products" bttnType="third" label="Products" icon="table-25gray-16.png" iconPosition="left"/>
                    <asButton v-if="active_workspace.default_tables.default_tables_projects && view == 'table' && viewTable == 'projects'" bttnType="third" label="Projects" icon="table-main-16.png" iconPosition="left" class="active"/>
                    <asButton v-else-if="active_workspace.default_tables.default_tables_projects" bttnType="third" label="Projects" icon="table-25gray-16.png" iconPosition="left"/>
                    <asButton v-if="active_workspace.default_tables.default_tables_employees && view == 'table' && viewTable == 'employees'" bttnType="third" label="Employees" icon="table-main-16.png" iconPosition="left" class="active"/>
                    <asButton v-else-if="active_workspace.default_tables.default_tables_employees" bttnType="third" label="Employees" icon="table-25gray-16.png" iconPosition="left"/>

                    <asButton bttnType="third" label="Create new table" icon="plus-25gray-16.png" iconPosition="left" @click="newTableWizard()"/>
                </template>
            </div>
			<div class="as-separator"></div>
            <div class="menuOptions">
                <asButton bttnType="third" label="Account Settings" icon="user-25gray-16.png" iconPosition="left"/>
                <asButton bttnType="third" label="Logout" icon="logout-25gray-16.png" iconPosition="left" @click="logout()"/>
            </div>
        </div>
        <div class="content">
            <div class="breadcrumbs">
              <h5>{{ active_workspace.name }}</h5>
              <img src="../assets/arrowRight-25gray-16.png"/>
              <h5 v-if="!active_workspace.active">Setup</h5>
              <h5 v-else>Dashboard</h5>
            </div>
            <form v-if="!active_workspace.active" class="setupSection" v-on:submit.prevent="saveWorkspace()">
                <div class="sectionBox">
                    <h5><span style="color: var(--main)">A.</span> Before starting, we’ll need to configure a few things first:</h5>
			        <div class="as-separator"></div>
                    <asField label="A.1. Workspace Name" icon="folder-main-16.png" type="text" placeholder="Choose a short and friendly name" name="workspace_name" v-model="active_workspace.name" required/>
                    <div class="workspace-default-tables">
                        <p>A.2. Choose Initial tables <span style="color: var(--50-gray)">(after setup you will be able to add custom others too)</span></p>
                        <label><input type="checkbox" name="defaultTables[]" value="default_tables_clients" v-model="active_workspace.default_tables.default_tables_clients"><p>Clients</p></label>
                        <label><input type="checkbox" name="defaultTables[]" value="default_tables_contracts" v-model="active_workspace.default_tables.default_tables_contracts"><p>Contracts</p></label>
                        <label><input type="checkbox" name="defaultTables[]" value="default_tables_invoices" v-model="active_workspace.default_tables.default_tables_invoices"><p>Invoices</p></label>
                        <label><input type="checkbox" name="defaultTables[]" value="default_tables_products" v-model="active_workspace.default_tables.default_tables_products"><p>Products</p></label>
                        <label><input type="checkbox" name="defaultTables[]" value="default_tables_projects" v-model="active_workspace.default_tables.default_tables_projects"><p>Projects</p></label>
                        <label><input type="checkbox" name="defaultTables[]" value="default_tables_employees" v-model="active_workspace.default_tables.default_tables_employees"><p>Employees</p></label>
                    </div>
                </div>
                <asButton bttnType="main" icon="arrowRight-white-16.png" label="Save Workspace" :disabled="setupFormReady"/>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import asField from '@/components/asField.vue'
import asButton from '@/components/asButton.vue'

export default {
    name: 'Dashboard',
	components: { asField, asButton },
	data(){
		return{
			user: {
                jwt: null,
                id: null,
                email: null,
                display_name: null,
                personal_workspace: {
                    id: null,
                    active: null,
                    name: null,
                    default_tables: {
                        default_tables_clients: null,
                        default_tables_contracts: null,
                        default_tables_invoices: null,
                        default_tables_products: null,
                        default_tables_projects: null,
                        default_tables_employees: null,
                    }
                },
            },
            active_workspace:{
                id: null,
                active: null,
                name: null,
                default_tables: {
                    default_tables_clients: null,
                    default_tables_contracts: null,
                    default_tables_invoices: null,
                    default_tables_products: null,
                    default_tables_projects: null,
                    default_tables_employees: null,
                }
            },
            view: null,
            viewTable: null,
		}
	},
	computed: {
        setupFormReady: function(){
            const isEmpty = Object.values(this.active_workspace.default_tables).every(x => x == false)
            return isEmpty
        }
    },
	async mounted() {
        var userData = this.$cookies.get('allspace_user')
        if (userData == null){
            alert("Please login first!")
            this.$router.push({ name:'login' })
        } else {
            this.user.jwt = userData.jwt
            this.user.id = userData.id
            this.user.email = userData.email
            this.user.display_name = userData.display_name
            console.log("User: ", this.user)

            // Preluare date despre workspace-ul personal
            await axios.get( this.apiURL + 'workspaces?populate=default_tables&filters[owner][id][$eq]=' + this.user.id, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                console.log("Response: ", response)

                // Actualizare date personal workspace
                this.user.personal_workspace.id = response.data.data[0].id
                this.user.personal_workspace.active = response.data.data[0].attributes.active
                this.user.personal_workspace.name = response.data.data[0].attributes.name
                this.user.personal_workspace.default_tables.default_tables_clients = response.data.data[0].attributes.default_tables.default_tables_clients
                this.user.personal_workspace.default_tables.default_tables_contracts = response.data.data[0].attributes.default_tables.default_tables_contracts
                this.user.personal_workspace.default_tables.default_tables_invoices = response.data.data[0].attributes.default_tables.default_tables_invoices
                this.user.personal_workspace.default_tables.default_tables_products = response.data.data[0].attributes.default_tables.default_tables_products
                this.user.personal_workspace.default_tables.default_tables_projects = response.data.data[0].attributes.default_tables.default_tables_projects
                this.user.personal_workspace.default_tables.default_tables_employees = response.data.data[0].attributes.default_tables.default_tables_employees

                console.log("Personal Workspace: ", this.user.personal_workspace)

                // Setare workspace default in router-view
                this.active_workspace.id = this.user.personal_workspace.id
                this.active_workspace.active = this.user.personal_workspace.active
                this.active_workspace.name = this.user.personal_workspace.name
                this.active_workspace.default_tables.default_tables_clients = this.user.personal_workspace.default_tables.default_tables_clients
                this.active_workspace.default_tables.default_tables_contracts = this.user.personal_workspace.default_tables.default_tables_contracts
                this.active_workspace.default_tables.default_tables_invoices = this.user.personal_workspace.default_tables.default_tables_invoices
                this.active_workspace.default_tables.default_tables_products = this.user.personal_workspace.default_tables.default_tables_products
                this.active_workspace.default_tables.default_tables_projects = this.user.personal_workspace.default_tables.default_tables_projects
                this.active_workspace.default_tables.default_tables_employees = this.user.personal_workspace.default_tables.default_tables_employees

                console.log("Active Workspace: ", this.active_workspace)

                // Actualizare view
                if (this.active_workspace.active) this.view = "dashboard"
            }).catch((error) => {
                console.log("Error: ", error.response)
				alert(error.response.data.error.message)
            })
        }
    },
	methods: {
        logout(){
            this.$cookies.remove('allspace_user')
            this.$router.push({ name:'login' })
        },
        async saveWorkspace(){
            var updateData = { data: {
                "name": this.active_workspace.name,
                "active": true,
                "default_tables": {
                    "default_tables_clients": this.active_workspace.default_tables.default_tables_clients,
                    "default_tables_contracts": this.active_workspace.default_tables.default_tables_contracts,
                    "default_tables_invoices": this.active_workspace.default_tables.default_tables_invoices,
                    "default_tables_products": this.active_workspace.default_tables.default_tables_products,
                    "default_tables_projects": this.active_workspace.default_tables.default_tables_projects,
                    "default_tables_employees": this.active_workspace.default_tables.default_tables_employees,
                }
            } }
            console.log("Update Data: ", updateData)
            await axios.put(this.apiURL + 'workspaces/' + this.active_workspace.id + '?populate=default_tables', updateData, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                console.log("Response: ", response)

                // Actualizare view
                this.view = "dashboard"
                this.active_workspace.active = response.data.data.attributes.active

                if (this.active_workspace.id == this.user.personal_workspace.id){
                    this.user.personal_workspace.active = response.data.data.attributes.active
                    this.user.personal_workspace.name = response.data.data.attributes.name
                    this.user.personal_workspace.default_tables.default_tables_clients = response.data.data.attributes.default_tables.default_tables_clients
                    this.user.personal_workspace.default_tables.default_tables_contracts = response.data.data.attributes.default_tables.default_tables_contracts
                    this.user.personal_workspace.default_tables.default_tables_invoices = response.data.data.attributes.default_tables.default_tables_invoices
                    this.user.personal_workspace.default_tables.default_tables_products = response.data.data.attributes.default_tables.default_tables_products
                    this.user.personal_workspace.default_tables.default_tables_projects = response.data.data.attributes.default_tables.default_tables_projects
                    this.user.personal_workspace.default_tables.default_tables_employees = response.data.data.attributes.default_tables.default_tables_employees
                }
            }).catch((error) => {
                console.log("Error: ", error)
                console.log("Error Response: ", error.response)
				alert(error.response.data.error.message)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.as-container{
    display: flex;

    .sidemenu{
        width: calc(240px + 48px);
        display: flex;
        flex-direction: column;
        background: #fff;
        padding: 24px;
        height: 100vh;
        position: sticky;
        top: 0;
        gap: 24px;

        .as-logo{
            max-width: 128px;
            height: auto;
        }

        #workspace{
            background: linear-gradient(45deg, #5668F6 0%, #CC56F6 100%);
            border-radius: 3px;
            padding: 8px 16px;
            color: #fff;
            font-weight: 600;
            font-size: 16px;
            font-family: 'Poppins', sans-serif;
        }

        .menuItems{
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;

            button{
                width: 100%;
                justify-content: flex-start;

                &.active{
                    :deep(p) { color: var(--main); }
                }

                &:last-child{
                    opacity: 0.5;
                    &:hover{
                        opacity: 1;
                    }
                }
            }

            .setupText{
                color: var(--50-gray)
            }
        }

        .workspaceSettings, .menuOptions{
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;

            button{
                width: 100%;
                justify-content: flex-start;

                &.active{
                    :deep(p) { color: var(--main); }
                }
            }
        }
    }

    .content{
        width: 1px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        padding: 24px;
        gap: 24px;

        .breadcrumbs{
            display: flex;
            align-items: center;
            gap: 4px;

            img{ width: 16px; height: 16px; }

            > :last-child{ color: var(--main) }
        }

        .setupSection{
            display: flex;
            flex-direction: column;
            gap: 24px;

            h5 span{ font-weight: 600; }

            .workspace-default-tables{
                display: flex;
                flex-wrap: wrap;

                > p {
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 4px;
                    color: var(--25-gray);
                    width: 100%;
                }

                label {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    margin-right: 16px;
                }
            }
        }
    }
}
</style>