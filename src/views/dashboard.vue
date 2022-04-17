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
                <asButton v-else bttnType="third" label="Dashboard" icon="dashboard-25gray-16.png" iconPosition="left" @click="changeView('dashboard')"/>
                <asButton v-if="view == 'workspaceSettings'" bttnType="third" label="Workspace Settings" icon="wrench-main-16.png" iconPosition="left" class="active"/>
                <asButton v-else bttnType="third" label="Workspace Settings" icon="wrench-25gray-16.png" iconPosition="left" @click="changeView('workspaceSettings')"/>
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

                    <!-- <asButton bttnType="third" label="Create new table" icon="plus-25gray-16.png" iconPosition="left" @click="newTableWizard()"/> -->
                </template>
            </div>
			<div class="as-separator"></div>
            <div class="menuOptions">
                <asButton bttnType="third" label="Account Settings" icon="user-25gray-16.png" iconPosition="left" @click="accountSettings = true"/>
                <asButton bttnType="third" label="Logout" icon="logout-25gray-16.png" iconPosition="left" @click="logout()"/>
            </div>
        </div>
        <div class="content">
            <div class="breadcrumbs">
              <h5>{{ active_workspace.name }}</h5>
              <img src="../assets/arrowRight-25gray-16.png"/>
              <template v-if="view == 'dashboard'">
                <h5 v-if="!active_workspace.active">Setup</h5>
                <h5 v-else>Dashboard</h5>
              </template>
              <h5 v-else-if="view == 'workspaceSettings'">Workspace Settings</h5>
            </div>
            <div v-if="view == 'dashboard'" class="view-dashboard">
                <form v-if="!active_workspace.active" class="setupSection" v-on:submit.prevent="saveWorkspaceSetup()">
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
            <div v-if="view == 'workspaceSettings'" class="view-workspaceSettings" :class="{ 'loading' : workspace_settings.loading }">
                <div class="sectionBox sb-workspacesettings">
                    <div class="sectionBoxHead">
                        <h5>Workspace Settings</h5>
                        <asButton bttnType="main" label="Save changes" icon="save-white-16.png" @click="saveWorkspaceSettings()"/>
                    </div>
                    <div class="as-separator"></div>
                    <div class="row">
                        <asField label="Change workspace name" icon="folder-main-16.png" type="text" placeholder="Choose a short and friendly name" name="workspace_settings_name" v-model="workspace_settings.data.name" required/>
                        <div class="unlock-all-entries">
                            <p>Did an entry blocked?</p>
                            <asButton bttnType="secondary" label="Unlock all entries" icon="unlock-white-16.png" disabled/>
                        </div>
                    </div>
                    <div class="as-separator"></div>
                    <div class="manage-default-tables">
                        <p>Enable or disable default tables <span style="color: var(--50-gray)">(disabling an enabled table won’t remove any data)</span></p>
                        <label><input type="checkbox" name="workspace_settings_defaultTables[]" value="workspace_settings_default_tables_clients" v-model="workspace_settings.data.default_tables.default_tables_clients"><p>Clients</p></label>
                        <label><input type="checkbox" name="workspace_settings_defaultTables[]" value="workspace_settings_default_tables_contracts" v-model="workspace_settings.data.default_tables.default_tables_contracts"><p>Contracts</p></label>
                        <label><input type="checkbox" name="workspace_settings_defaultTables[]" value="workspace_settings_default_tables_invoices" v-model="workspace_settings.data.default_tables.default_tables_invoices"><p>Invoices</p></label>
                        <label><input type="checkbox" name="workspace_settings_defaultTables[]" value="workspace_settings_default_tables_products" v-model="workspace_settings.data.default_tables.default_tables_products"><p>Products</p></label>
                        <label><input type="checkbox" name="workspace_settings_defaultTables[]" value="workspace_settings_default_tables_projects" v-model="workspace_settings.data.default_tables.default_tables_projects"><p>Projects</p></label>
                        <label><input type="checkbox" name="workspace_settings_defaultTables[]" value="workspace_settings_default_tables_employees" v-model="workspace_settings.data.default_tables.default_tables_employees"><p>Employees</p></label>
                    </div>
                </div>
                <div class="sectionBox sb-manageroles">
                    <div class="sectionBoxHead">
                        <h5>Manage Roles</h5>
                        <asButton v-if="!manage_roles.new_custom_role_row" bttnType="main" label="Add new custom role" icon="plus-white-16.png" @click="manage_roles.new_custom_role_row = true"/>
                        <template v-else>
                            <asButton bttnType="secondary" label="Cancel" icon="block-white-16.png" @click="manage_roles.new_custom_role_row = false"/>
                            <asButton bttnType="main" label="Save new custom role" icon="save-white-16.png" @click="saveNewCustomRole()"/>
                        </template>
                    </div>
                    <div class="table">
                        <div class="tableHead">
                            <p class="tableHeadItem">Role Name</p>
                            <p class="tableHeadItem">View Dashboard</p>
                            <p class="tableHeadItem">Manage Roles</p>
                            <p class="tableHeadItem">Manage Users</p>
                            <p class="tableHeadItem">Manage Tables</p>
                            <p class="tableHeadItem grow">Tables Access</p>
                            <Popper hover arrow placement="left" class="auxClass">
                                <img src="../assets/info-white-16.png"/>
                                <template #content>
                                    <p>2 = Management (Add/Edit/Remove/View Entries + Discuss)</p>
                                    <p>3 = Analyze (View Entries + Discuss)</p>
                                </template>
                            </Popper>
                        </div>
                        <div class="tableRows">
                            <div class="tableRow" v-if="!manage_roles.new_custom_role_row">
                                <p>Owner</p>
                                <input type="checkbox" checked disabled>
                                <input type="checkbox" checked disabled>
                                <input type="checkbox" checked disabled>
                                <input type="checkbox" checked disabled>
                                <p class="grow">All (2)</p>
                            </div>
                            <div class="tableRow" v-if="!manage_roles.new_custom_role_row">
                                <p>Manager</p>
                                <input type="checkbox" checked disabled>
                                <input type="checkbox" checked disabled>
                                <input type="checkbox" checked disabled>
                                <input type="checkbox" checked disabled>
                                <p class="grow">All (2)</p>
                            </div>
                            <div class="tableRow" v-if="!manage_roles.new_custom_role_row">
                                <p>Analyst</p>
                                <input type="checkbox" checked disabled>
                                <input type="checkbox" disabled>
                                <input type="checkbox" disabled>
                                <input type="checkbox" disabled>
                                <p class="grow">None</p>
                            </div>
                            <template v-for="(data, role) in active_workspace.custom_roles">
                                <div class="tableRow" v-if="!manage_roles.new_custom_role_row">
                                    <p>{{ role }}</p>
                                    <input type="checkbox" :checked="data.view_dashboard" disabled>
                                    <input type="checkbox" :checked="data.manage_roles" disabled>
                                    <input type="checkbox" :checked="data.manage_users" disabled>
                                    <input type="checkbox" :checked="data.manage_tables" disabled>
                                    <p v-if="data.tables_access == 'all'" class="grow">All (2)</p>
                                    <p v-else class="grow">
                                        <template v-for="(level, name) in data.tables_access"><template v-if="level != 4">{{ name }}({{ level }})<span class="a-comma">, </span></template></template>
                                    </p>
                                    <div class="rowButtons">
                                        <!-- <img src="../assets/icBttn-mainGlass-25gray-edit.png" @click="editRole(role)"/> -->
                                        <img src="../assets/icBttn-mainGlass-25gray-delete.png" @click="deleteRole(role)"/>
                                    </div>
                                </div>
                            </template>
                            <div class="tableRow addNewRole" v-if="manage_roles.new_custom_role_row">
                                <asField type="text" name="role_name" placeholder="Role name" v-model="manage_roles.new_role.name" hideLabel required/>
                                <input type="checkbox" name="view_dashboard" v-model="manage_roles.new_role.view_dashboard" />
                                <input type="checkbox" name="manage_roles" v-model="manage_roles.new_role.manage_roles" @change="manageRolesChanged()"/>
                                <input type="checkbox" name="manage_users" v-model="manage_roles.new_role.manage_users" :disabled="manage_roles.new_role.manage_roles"/>
                                <input type="checkbox" name="manage_tables" v-model="manage_roles.new_role.manage_tables" />
                                <p v-if="!manage_roles.new_role.manage_tables" class="grow">Choose the tables accesses below:</p>
                                <p v-else class="grow">All</p>
                                <div v-if="!manage_roles.new_role.manage_tables" class="list-of-tables">
                                    <div class="listItem" v-if="active_workspace.default_tables.default_tables_clients">
                                        <p>Clients:</p>
                                        <select name="newRole_accessTable_clients" v-model.number="manage_roles.new_role.tables_access.clients">
                                            <option value="4">None</option><option value="3">Analyze</option><option value="2">Management</option>
                                        </select>
                                    </div>
                                    <div class="listItem" v-if="active_workspace.default_tables.default_tables_contracts">
                                        <p>Contracts:</p>
                                        <select name="newRole_accessTable_contracts" v-model.number="manage_roles.new_role.tables_access.contracts">
                                            <option value="4">None</option><option value="3">Analyze</option><option value="2">Management</option>
                                        </select>
                                    </div>
                                    <div class="listItem" v-if="active_workspace.default_tables.default_tables_invoices">
                                        <p>Invoices:</p>
                                        <select name="newRole_accessTable_invoices" v-model.number="manage_roles.new_role.tables_access.invoices">
                                            <option value="4">None</option><option value="3">Analyze</option><option value="2">Management</option>
                                        </select>
                                    </div>
                                    <div class="listItem" v-if="active_workspace.default_tables.default_tables_products">
                                        <p>Products:</p>
                                        <select name="newRole_accessTable_products" v-model.number="manage_roles.new_role.tables_access.products">
                                            <option value="4">None</option><option value="3">Analyze</option><option value="2">Management</option>
                                        </select>
                                    </div>
                                    <div class="listItem" v-if="active_workspace.default_tables.default_tables_projects">
                                        <p>Projects:</p>
                                        <select name="newRole_accessTable_projects" v-model.number="manage_roles.new_role.tables_access.projects">
                                            <option value="4">None</option><option value="3">Analyze</option><option value="2">Management</option>
                                        </select>
                                    </div>
                                    <div class="listItem" v-if="active_workspace.default_tables.default_tables_employees">
                                        <p>Employees:</p>
                                        <select name="newRole_accessTable_employees" v-model.number="manage_roles.new_role.tables_access.employees">
                                            <option value="4">None</option><option value="3">Analyze</option><option value="2">Management</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <form class="sectionBox sb-manageusers" v-on:submit.prevent="sendUserInvitation()">
                    <div class="sectionBoxHead">
                        <h5>Manage Users</h5>
                        <asButton v-if="!manage_users.invite_user_row" bttnType="main" label="Invite user" icon="plus-white-16.png" @click="manage_users.invite_user_row = true"/>
                        <template v-else>
                            <asButton bttnType="secondary" label="Cancel" icon="block-white-16.png" @click="manage_users.invite_user_row = false"/>
                            <asButton bttnType="main" label="Send invitation" icon="mail-white-16.png"/>
                        </template>
                    </div>
                    <div class="table">
                        <div class="tableHead" :class="{ 'inviteUser' : manage_users.invite_user_row }">
                            <p class="tableHeadItem grow" v-if="!manage_users.invite_user_row">Display Name</p>
                            <p class="tableHeadItem grow">Email Address</p>
                            <p class="tableHeadItem grow">Role</p>
                        </div>
                        <div class="tableRows">
                            <template v-for="(data, id) in manage_users.users" v-if="!manage_users.invite_user_row">
                                <div class="tableRow" :class="{ 'owner' : data.role=='owner', 'editable' : manage_users.editingUser == id }">
                                    <p class="grow" v-if="data.custom_role != 'pending'">{{ data.display_name }}</p>
                                    <p class="grow pending" v-else>Pending Invitation</p>
                                    <p class="grow">{{ data.email }}</p>
                                    <p v-if="data.role != 'custom'" class="grow">{{ data.role }}</p>
                                    <p v-else class="grow">{{ data.custom_role }}</p>
                                    <div class="rowButtons" v-if="data.role != 'owner' && data.custom_role != 'pending'">
                                        <img src="../assets/icBttn-mainGlass-25gray-edit.png" @click="editUser(id)"/>
                                        <img src="../assets/icBttn-mainGlass-25gray-close.png" @click="kickUser(id)"/>
                                    </div>
                                    <div class="rowButtons" v-else-if="data.custom_role == 'pending'">
                                        <img class="twoxbutton" src="../assets/icBttnX2-mainGlass-25gray-close.png" @click="revokeInvitation(id)"/>
                                    </div>
                                </div>
                            </template>
                            <div class="tableRow inviteUser" v-else>
                                <asField type="email" name="user_email" placeholder="new_user_email_address@gmail.com" v-model="manage_users.new_user.email" hideLabel required class="grow"/>
                                <select name="user_role" v-model="manage_users.new_user.role" class="grow">
                                    <option disabled="" value="">Select a role</option>
                                    <option value="manager">Manager</option>
                                    <option value="analyst">Analyst</option>
                                    <template v-for="(data, name) in active_workspace.custom_roles">
                                        <option :value="name">{{ name }}</option>
                                    </template>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <asAccountSettings v-if="accountSettings" @closeAccountSettings="accountSettings = false"/>
</template>

<script>
import axios from 'axios'
import asField from '@/components/asField.vue'
import asButton from '@/components/asButton.vue'
import asAccountSettings from '@/components/asAccountSettings.vue'
import Popper from "vue3-popper"

export default {
    name: 'Dashboard',
	components: { asField, asButton, asAccountSettings, Popper },
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
                    },
                    custom_roles: null,
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
                },
                custom_roles: null,
            },
            view: "dashboard",
            viewTable: null,
            accountSettings: false,
            workspace_settings: {
                loading: false,
                data: {
                    name: null,
                    default_tables: {
                        default_tables_clients: null,
                        default_tables_contracts: null,
                        default_tables_invoices: null,
                        default_tables_products: null,
                        default_tables_projects: null,
                        default_tables_employees: null,
                    }
                }
            },
            manage_roles: {
                new_custom_role_row: false,
                new_role: {
                    name: null,
                    view_dashboard: false,
                    manage_roles: false,
                    manage_users: false,
                    manage_tables: false,
                    tables_access: {
                        clients: 4,
                        contracts: 4,
                        invoices: 4,
                        products: 4,
                        projects: 4,
                        employees: 4,
                    }
                }
            },
            manage_users: {
                invite_user_row: false,
                users: {},
                new_user: {
                    email: null,
                    role: "",
                },
                editingUser: null,
            }
		}
	},
	computed: {
        setupFormReady(){
            const isEmpty = Object.values(this.active_workspace.default_tables).every(x => x == false)
            return isEmpty
        }
    },
	async mounted() {
        console.log('\n', '\n', "===== MOUNTING... =====")
        await this.fetchUser() // Preluare date user
        await this.fetchPersonalWorkspace() // Preluare date workspace personal
        await this.changeWorkspace( this.user.personal_workspace.id ) // Setare workspace default in router-view

        if(this.$route.params.fromInvitation){
            console.log('Coming from an invitation registration')
        }
    },
	methods: {
        fetchUser(){
            console.log("Method: fetchUser()")
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
            }
        },
        logout(){
            this.$cookies.remove('allspace_user')
            this.$router.push({ name:'login' })
        },
        async fetchPersonalWorkspace(){
            console.log("Method: fetchPersonalWorkspace()")
            await axios.get( this.apiURL + 'workspaces?populate=default_tables&filters[owner][id][$eq]=' + this.user.id, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                console.log("Response: ", response)

                // Actualizare date personal workspace
                this.user.personal_workspace.id = response.data.data[0].id
                this.user.personal_workspace.active = response.data.data[0].attributes.active
                this.user.personal_workspace.name = response.data.data[0].attributes.name
                this.user.personal_workspace.custom_roles = response.data.data[0].attributes.custom_roles
                for (let [key, value] of Object.entries(this.user.personal_workspace.default_tables)) this.user.personal_workspace.default_tables[key] = response.data.data[0].attributes.default_tables[key]

                console.log("Personal Workspace: ", this.user.personal_workspace)

                // Actualizare active workspace daca e nevoie
                if (this.active_workspace.id == this.user.personal_workspace.id){
                    this.active_workspace.active = this.user.personal_workspace.active
                    this.active_workspace.name = this.user.personal_workspace.name
                    this.active_workspace.custom_roles = this.user.personal_workspace.custom_roles
                    for (let [key, value] of Object.entries(this.active_workspace.default_tables)) this.active_workspace.default_tables[key] = this.user.personal_workspace.default_tables[key]
                    console.log("Active Workspace: ", this.active_workspace)
                }
            }).catch((error) => {
                console.log("Error: ", error)
                console.log("Error Response: ", error.response)

				// Daca a expirat token-ul
                if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                    alert("Your session expired, please login again!")
                    this.logout()
                } else alert(error.response.data.error.message)
            })
        },
        async changeWorkspace(workspaceID){
            console.log("Method: changeWorkspace(" + workspaceID + ")")
            await axios.get( this.apiURL + 'workspaces/' + workspaceID + '?populate=*', { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                console.log("Response Data Data: ", response.data.data)
                this.active_workspace.id = response.data.data.id
                this.active_workspace.active = response.data.data.attributes.active
                this.active_workspace.name = response.data.data.attributes.name
                this.active_workspace.custom_roles = response.data.data.attributes.custom_roles
                for (let [key, value] of Object.entries(this.active_workspace.default_tables)) this.active_workspace.default_tables[key] = response.data.data.attributes.default_tables[key]
                console.log("Active Workspace: ", this.active_workspace)
            }).catch((error) => {
                console.log("Error: ", error)
                console.log("Error Response: ", error.response)

				// Daca a expirat token-ul
                if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                    alert("Your session expired, please login again!")
                    this.logout()
                } else alert(error.response.data.error.message)
            })
        },
        async fetchActiveWorkspace(){
            console.log("Method: fetchActiveWorkspace()")
            await axios.get( this.apiURL + 'workspaces/' + this.active_workspace.id + '?populate=*', { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                console.log("Response Data Data: ", response.data.data)
                this.active_workspace.id = response.data.data.id
                this.active_workspace.active = response.data.data.attributes.active
                this.active_workspace.name = response.data.data.attributes.name
                this.active_workspace.custom_roles = response.data.data.attributes.custom_roles
                for (let [key, value] of Object.entries(this.active_workspace.default_tables)) this.active_workspace.default_tables[key] = response.data.data.attributes.default_tables[key]
                console.log("Active Workspace: ", this.active_workspace)
            }).catch((error) => {
                console.log("Error: ", error)
                console.log("Error Response: ", error.response)

				// Daca a expirat token-ul
                if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                    alert("Your session expired, please login again!")
                    this.logout()
                } else alert(error.response.data.error.message)
            })
        },
        async saveWorkspaceSetup(){
            console.log("Method: saveWorkspaceSetup()")
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

                // Actualizare View
                this.view = "dashboard"

                // Actualizare Personal Workspace
                if (this.active_workspace.id == this.user.personal_workspace.id){
                    this.user.personal_workspace.active = response.data.data.attributes.active
                    this.user.personal_workspace.name = response.data.data.attributes.name
                    this.user.personal_workspace.default_tables = response.data.data.attributes.default_tables
                }

                // Actualizare Active Workspace
                this.active_workspace.active = response.data.data.attributes.active
                this.active_workspace.name = response.data.data.attributes.name
                this.active_workspace.default_tables = response.data.data.attributes.default_tables
            }).catch((error) => {
                console.log("Error: ", error)
                console.log("Error Response: ", error.response)

                // Daca a expirat token-ul
                if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                    alert("Your session expired, please login again!")
                    this.logout()
                } else alert(error.response.data.error.message)
            })
        },
        async changeView(view){
            console.log("Method: changeView(" + view + ")")
            this.view = view
            if (view == 'workspaceSettings'){
                console.log("Active Workspace: ", this.active_workspace)
                console.log("Personal Workspace: ", this.user.personal_workspace)
                console.log("Workspace Settings: ", this.workspace_settings)

                // Actualizare Workspace Settings
                this.workspace_settings.loading = false
                this.workspace_settings.data.name = this.active_workspace.name
                for (let [key, value] of Object.entries(this.workspace_settings.data.default_tables)) this.workspace_settings.data.default_tables[key] = this.active_workspace.default_tables[key]
                this.manage_roles.new_custom_role_row = false
                this.manage_users.invite_user_row = false

                // Preluare utilizatori
                await axios.get(this.apiURL + 'user-and-workspaces/workspaceUsers/' + this.active_workspace.id, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                    console.log("Response: ", response)

                    // Actualizare Workspace Users
                    this.manage_users.users = response.data
                    console.log("Manage Users: ", this.manage_users)
                }).catch((error) => {
                    console.log("Error: ", error)
                    console.log("Error Response: ", error.response)

                    // Daca a expirat token-ul
                    if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                        alert("Your session expired, please login again!")
                        this.logout()
                    } else alert(error.response.data.error.message)
                })
            }
        },
        async saveWorkspaceSettings(){
            console.log("Method: saveWorkspaceSettings()")
            console.log("Before Change - Active Workspace: ", this.active_workspace)
            console.log("Before Change - Personal Workspace: ", this.user.personal_workspace)
            console.log("Before Change - Workspace Settings: ", this.workspace_settings)

            // Actualizare Workspace Settings
            this.workspace_settings.loading = true

            // Request actualizare nume si/sau default tables
            await axios.put(this.apiURL + 'workspaces/' + this.active_workspace.id + '?populate=default_tables', { data: this.workspace_settings.data }, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                console.log("Response: ", response)

                // Actualizare Personal Workspace
                if (this.active_workspace.id == this.user.personal_workspace.id){
                    this.user.personal_workspace.active = response.data.data.attributes.active
                    this.user.personal_workspace.name = response.data.data.attributes.name
                    this.user.personal_workspace.default_tables = response.data.data.attributes.default_tables
                    this.user.personal_workspace.custom_roles = response.data.data.attributes.custom_roles
                }

                // Actualizare Active Workspace
                this.active_workspace.active = response.data.data.attributes.active
                this.active_workspace.name = response.data.data.attributes.name
                this.active_workspace.default_tables = response.data.data.attributes.default_tables
                this.active_workspace.custom_roles = response.data.data.attributes.custom_roles

                // Refresh
                this.changeView('workspaceSettings')
            }).catch((error) => {
                console.log("Error: ", error)
                console.log("Error Response: ", error.response)

                // Daca a expirat token-ul
                if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                    alert("Your session expired, please login again!")
                    this.logout()
                } else alert(error.response.data.error.message)

                // Actualizare Workspace Settings
                this.workspace_settings.loading = false
            })
        },
        async saveNewCustomRole(){
            console.log("Method: saveNewCustomRole()")
            console.log("Manage Roles: ", this.manage_roles)
            var checkTables = Object.values(this.manage_roles.new_role.tables_access).every((item) => { return item == 4 })

            // Validare date
            if(!this.manage_roles.new_role.name) alert ("You forgot to choose a name for the new custom role!")
            else if (checkTables && !this.manage_roles.new_role.view_dashboard && !this.manage_roles.new_role.manage_roles && !this.manage_roles.new_role.manage_users && !this.manage_roles.new_role.manage_tables) alert ("Please choose at least one type of right for the new custom role!")
            else {
                // Actualizare Workspace Settings
                this.workspace_settings.loading = true

                // Declarare body request
                var requestData = this.manage_roles.new_role
                requestData.workspaceID = this.active_workspace.id

                // Request salvare rol
                await axios.post(this.apiURL + 'workspaces/createCustomRole/', requestData, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                    console.log("Response: ", response)

                    // Actualizare active workspace
                    this.fetchActiveWorkspace()

                    // Curatare formular rol nou
                    this.manage_roles.new_role = {
                        name: null,
                        view_dashboard: false,
                        manage_roles: false,
                        manage_users: false,
                        manage_tables: false,
                        tables_access: {
                            clients: 4,
                            contracts: 4,
                            invoices: 4,
                            products: 4,
                            projects: 4,
                            employees: 4,
                        }
                    }

                    // Refresh
                    this.changeView('workspaceSettings')
                }).catch((error) => {
                    console.log("Error: ", error)
                    console.log("Error Response: ", error.response)

                    // Daca a expirat token-ul
                    if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                        alert("Your session expired, please login again!")
                        this.logout()
                    } else alert(error.response.data.error.message)

                    // Actualizare Workspace Settings
                    this.workspace_settings.loading = false
                })
            }
        },
        async deleteRole(role){
            console.log("Method: deleteRole(" + role + ")")

            let confirmAction = confirm("Are you sure you want to remove role '" + role + "'?\nAll users with this role will get the role 'Analyst'.")
            if (confirmAction){
                // Actualizare Workspace Settings
                this.workspace_settings.loading = true

                var requestData = {
                    workspaceID: this.active_workspace.id,
                    roleName: role
                }
                await axios.post(this.apiURL + 'workspaces/deleteCustomRole/', requestData, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                    console.log("Response: ", response)

                    // Actualizare active workspace
                    this.fetchActiveWorkspace()

                    // Refresh
                    this.changeView('workspaceSettings')
                }).catch((error) => {
                    console.log("Error: ", error)
                    console.log("Error Response: ", error.response)

                    // Daca a expirat token-ul
                    if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                        alert("Your session expired, please login again!")
                        this.logout()
                    } else alert(error.response.data.error.message)

                    // Actualizare Workspace Settings
                    this.workspace_settings.loading = false
                })
            }
        },
        async kickUser(id){
            console.log("Method: kickUser(" + id + ")")

            let confirmAction = confirm("Are you sure you want to kick '" + this.manage_users.users[id].display_name + "' from the workspace?")
            if (confirmAction){
                // Actualizare Workspace Settings
                this.workspace_settings.loading = true

                await axios.delete(this.apiURL + 'user-and-workspaces/' + this.manage_users.users[id].user_and_workspace, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                    console.log("Response: ", response)

                    // Actualizare active workspace
                    this.fetchActiveWorkspace()

                    // Refresh
                    this.changeView('workspaceSettings')
                }).catch((error) => {
                    console.log("Error: ", error)
                    console.log("Error Response: ", error.response)

                    // Daca a expirat token-ul
                    if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                        alert("Your session expired, please login again!")
                        this.logout()
                    } else alert(error.response.data.error.message)

                    // Actualizare Workspace Settings
                    this.workspace_settings.loading = false
                })
            }
        },
        async revokeInvitation(id){
            console.log("Method: revokeInvitation(" + id + ")")

            let confirmAction = confirm("Are you sure you want to revoke the invitation for '" + this.manage_users.users[id].display_name + "'?")
            if (confirmAction){
                // Actualizare Workspace Settings
                this.workspace_settings.loading = true

                // Stergere "pending-" din "id"
                id = parseInt(id.slice(8))
                console.log(id)

                await axios.delete(this.apiURL + 'pending-invitations/' + id, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                    console.log("Response: ", response)

                    // Actualizare active workspace
                    this.fetchActiveWorkspace()

                    // Refresh
                    this.changeView('workspaceSettings')
                }).catch((error) => {
                    console.log("Error: ", error)
                    console.log("Error Response: ", error.response)

                    // Daca a expirat token-ul
                    if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                        alert("Your session expired, please login again!")
                        this.logout()
                    } else alert(error.response.data.error.message)

                    // Actualizare Workspace Settings
                    this.workspace_settings.loading = false
                })
            }
        },
        async sendUserInvitation(){
            console.log("Method: sendUserInvitation()")
            console.log("Manage Users: ", this.manage_users)

            // Validare date
            if (!this.manage_users.new_user.role) alert ("Please choose a role for the invited person!")
            else {
                // Actualizare Workspace Settings
                this.workspace_settings.loading = true

                // Declarare body request
                var requestData = { data: {
                    email: this.manage_users.new_user.email,
                    workspace: this.active_workspace.id,
                    role: this.manage_users.new_user.role,
                    invited_by: this.user.id
                } }
                

                await axios.post(this.apiURL + 'pending-invitations/', requestData, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                    console.log("Response: ", response)

                    // Actualizare active workspace
                    this.fetchActiveWorkspace()

                    // Curatare formular invitare user
                    this.manage_users.new_user = {
                        email: null,
                        role: "",
                    }

                    // Refresh
                    this.changeView('workspaceSettings')
                }).catch((error) => {
                    console.log("Error: ", error)
                    console.log("Error Response: ", error.response)

                    // Daca a expirat token-ul
                    if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                        alert("Your session expired, please login again!")
                        this.logout()
                    } else alert(error.response.data.error.message)

                    // Actualizare Workspace Settings
                    this.workspace_settings.loading = false
                })
            }
        },
        manageRolesChanged(){
            if (this.manage_roles.new_role.manage_roles) this.manage_roles.new_role.manage_users = true
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
            background: var(--brand-gradient);
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

                // &:last-child{
                //     opacity: 0.5;
                //     &:hover{
                //         opacity: 1;
                //     }
                // }
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

        .view-dashboard{
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

        .view-workspaceSettings{
            display: flex;
            flex-direction: column;
            gap: 24px;
            &.loading{
                pointer-events: none;
                filter: grayscale(1);
                opacity: 0.5;
            }
            .sectionBox{
                .sectionBoxHead{
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    h5{ flex-grow: 1; }
                }

                &.sb-workspacesettings{
                    .row{
                        display: grid;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        align-items: end;
                        gap: 24px;

                        .unlock-all-entries{
                            display: flex;
                            flex-direction: column;
                            p{
                                font-weight: 600;
                                margin-bottom: 4px;
                            }
                            button{
                                :deep(p){
                                    flex-grow: 1;
                                    text-align: left;
                                }
                            }
                        }
                    }
                    
                    .manage-default-tables{
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

                &.sb-manageroles{
                    .tableHead{
                        .auxClass{
                            margin: 0 !important;
                            padding: 0;
                            width: 16px;
                            height: 16px;
                            display: flex;
                            border: 0 !important;

                            img{
                                width: 16px;
                            }
                        }
                    }
                    .tableRow{
                        p:first-child{
                            text-transform: capitalize;
                        }
                        p:last-child{
                            text-transform: capitalize;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                        .a-comma:last-child{ display: none; }
                    }
                    .addNewRole{
                        flex-wrap: wrap;
                        padding: 24px;
                        // background: var(--main);
                        border-radius: 0 0 3px 3px;

                        > p {
                            // color: var(--pure-white);
                            font-weight: 600;
                        }

                        .list-of-tables{
                            width: 100%;
                            background: var(--main-glass);
                            padding: 24px;
                            display: grid;
                            grid-template-columns: repeat(6, minmax(0, 1fr));
                            gap: 24px;
                            border-radius: 3px;

                            .listItem{
                                min-width: 128px;
                                flex-grow: 1;
                                display: flex;
                                flex-direction: column;

                                p{
                                    margin-bottom: 4px;
                                    font-weight: 600;
                                }

                                select{
                                    width: 100%;
                                    font-family: 'Poppins', sans-serif;
                                    font-size: 14px;
                                    border: 0;
                                    border-radius: 3px;
                                    padding: 8px;
                                    border-right: 8px solid transparent;
                                }
                            }
                        }
                    }
                }
                &.sb-manageusers{
                    .tableHead:not(.inviteUser){
                        padding-right: calc(48px + 60px)
                    }
                    .tableRows{
                        .tableRow{
                            p:first-child.pending{
                                font-weight: 600;
                                background: var(--brand-gradient);
                                -webkit-background-clip: text;
                                -webkit-text-fill-color: transparent;
                                background-clip: text;
                                text-fill-color: transparent;
                                text-transform: uppercase;
                            }
                            p:nth-child(3){
                                text-transform: capitalize;
                            }
                            &.owner{
                                padding-right: calc(48px + 60px)
                            }
                            select{
                                font-family: 'Poppins', sans-serif;
                                font-size: 14px;
                                border-radius: 3px;
                                padding: 12px 24px;
                                text-transform: capitalize;
                            }
                            &.inviteUser{
                                > *{
                                    flex: 1 1 50%;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>