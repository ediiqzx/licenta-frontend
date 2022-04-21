<template>
    <div class="as-container">
        <div class="sidemenu">
            <img src="../assets/logo.png" class="as-logo"/>
            <select id="workspace" name="workspace" v-model="active_workspace.id" @change="changeWorkspace(active_workspace.id)">
                <option :value="user.personal_workspace.id">{{ user.personal_workspace.name }}</option>
                <option v-for="(data, id) in user.workspaces" :value="id">{{ data.name }}</option>
            </select>
			<div v-if="active_workspace.active" class="as-separator"></div>
            <div v-if="active_workspace.active" class="workspaceSettings">
                <asButton v-if="view == 'dashboard'" bttnType="third" label="Dashboard" icon="dashboard-main-16.png" iconPosition="left" class="active"/>
                <asButton v-else bttnType="third" label="Dashboard" icon="dashboard-25gray-16.png" iconPosition="left" @click="changeView('dashboard')"/>
                <asButton v-if="view == 'workspaceSettings'" bttnType="third" label="Workspace Settings" icon="wrench-main-16.png" iconPosition="left" class="active"/>
                <asButton v-else bttnType="third" label="Workspace Settings" icon="wrench-25gray-16.png" iconPosition="left" @click="changeView('workspaceSettings')"/>
                <asButton v-if="active_workspace.id != user.personal_workspace.id" bttnType="third" label="Leave Workspace" icon="logout-red-16.png" iconPosition="left" @click="leaveWorkspace(user.workspaces[active_workspace.id].user_and_workspace_ID)"/>
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
                                <div class="tableRow" :class="{ 'noButtons' : data.role=='owner' || id == user.id, 'editable' : manage_users.editing_user == id }">
                                    <p class="grow" v-if="data.custom_role != 'pending'">{{ data.display_name }}</p>
                                    <p class="grow pending" v-else>Pending Invitation</p>
                                    <p class="grow">{{ data.email }}</p>
                                    <template v-if="manage_users.editing_user.id != id">
                                        <p v-if="data.role != 'custom'" class="grow">{{ data.role }}</p>
                                        <p v-else class="grow">{{ data.custom_role }}</p>
                                        <div class="rowButtons" v-if="id != user.id && data.role != 'owner' && data.custom_role != 'pending'">
                                            <img src="../assets/icBttn-mainGlass-25gray-edit.png" @click="editUser(id)"/>
                                            <img src="../assets/icBttn-mainGlass-25gray-close.png" @click="kickUser(id)"/>
                                        </div>
                                        <div class="rowButtons" v-else-if="data.custom_role == 'pending'">
                                            <img class="twoxbutton" src="../assets/icBttnX2-mainGlass-25gray-close.png" @click="revokeInvitation(id)"/>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <select name="new_role" v-model="manage_users.editing_user.new_role" class="grow">
                                            <option disabled value="">Select new role</option>
                                            <option value="manager">Manager</option>
                                            <option value="analyst">Analyst</option>
                                            <template v-for="(data, name) in active_workspace.custom_roles">
                                                <option :value="name">{{ name }}</option>
                                            </template>
                                        </select>
                                        <div class="rowButtons">
                                            <img src="../assets/icBttn-mainGlass-25gray-check.png" @click="updateRole()"/>
                                            <img src="../assets/icBttn-mainGlass-25gray-close.png" @click="editUser(null)"/>
                                        </div>
                                    </template>
                                    
                                </div>
                            </template>
                            <div class="tableRow inviteUser" v-else>
                                <asField type="email" name="user_email" placeholder="new_user_email_address@gmail.com" v-model="manage_users.new_user.email" hideLabel required class="grow"/>
                                <select name="user_role" v-model="manage_users.new_user.role" class="grow">
                                    <option disabled value="">Select a role</option>
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
                workspaces: {}
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
                editing_user: {
                    id: null,
                    new_role: "",
                }
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
        
        // Setare workspace default in router-view
        if(this.$route.params.fromInvitation){
            console.log('Coming from an invitation registration')
            await this.changeWorkspace ( this.$route.params.fromInvitation )
        } else await this.changeWorkspace( this.user.personal_workspace.id )
    },
	methods: {
        async fetchUser(){
            console.log("Method: fetchUser()")
            var userData = this.$cookies.get('allspace_user')
            if (userData == null){
                alert("Please login first!")
                this.$router.push({ name:'login' })
            } else {
                let toUpdate = ['jwt', 'id', 'email', 'display_name']
                toUpdate.forEach(item => this.user[item] = userData[item])
                console.log("user: ", this.user)
            }

            // Preluare workspace-uri
            await axios.get(this.apiURL + 'user-and-workspaces/?populate=*&filters[role][$ne]=owner&filters[user][id][$eq]=' + this.user.id, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                console.log("response: ", response)

                if (!response.data.data.length) console.log("Have only personal workspace")
                else{
                    response.data.data.forEach((item, index) => {
                        this.user.workspaces[item.attributes.workspace.data.id] = {
                            name: item.attributes.workspace.data.attributes.name,
                            role: item.attributes.role,
                            custom_role: item.attributes.custom_role,
                            user_and_workspace_ID: item.id
                        }
                    })
                    console.log("user.workspaces: ", this.user.workspaces)
                }
            }).catch((error) => {
                console.log("error: ", error)
                console.log("error.response: ", error.response)

				// Daca a expirat token-ul
                if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                    alert("Your session expired, please login again!")
                    this.logout()
                } else alert(error.response.data.error.message)
            })
        },
        logout(){
            console.log("Method: logout()")
            this.$cookies.remove('allspace_user')
            this.$router.push({ name:'login' })
        },
        async fetchPersonalWorkspace(){
            console.log("Method: fetchPersonalWorkspace()")

            await axios.get( this.apiURL + 'workspaces?populate=default_tables&filters[owner][id][$eq]=' + this.user.id, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                console.log("response: ", response)

                // Actualizare personal workspace
                this.user.personal_workspace.id = response.data.data[0].id
                let toUpdate = ['active', 'name', 'custom_roles']
                toUpdate.forEach(item => this.user.personal_workspace[item] = response.data.data[0].attributes[item])
                for (let [key, value] of Object.entries(this.user.personal_workspace.default_tables)) this.user.personal_workspace.default_tables[key] = response.data.data[0].attributes.default_tables[key]
                
                console.log("user.personal_workspace: ", this.user.personal_workspace)

                // Actualizare active workspace daca e nevoie
                if (this.active_workspace.id == this.user.personal_workspace.id){
                    let toUpdate = ['active', 'name', 'custom_roles']
                    toUpdate.forEach(item => this.active_workspace[item] = this.user.personal_workspace[item])
                    for (let [key, value] of Object.entries(this.active_workspace.default_tables)) this.active_workspace.default_tables[key] = this.user.personal_workspace.default_tables[key]
                    console.log("active_workspace: ", this.active_workspace)
                }
            }).catch((error) => {
                console.log("error: ", error)
                console.log("error.response: ", error.response)

				// Daca a expirat token-ul
                if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                    alert("Your session expired, please login again!")
                    this.logout()
                } else alert(error.response.data.error.message)
            })
        },
        async changeWorkspace(workspaceID, redirect_to_dashboard = true){
            console.log("Method: changeWorkspace(" + workspaceID + ")")

            await axios.get( this.apiURL + 'workspaces/' + workspaceID + '?populate=*', { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                console.log("response.data.data: ", response.data.data)

                // Actualizare active workspace
                this.active_workspace.id = response.data.data.id
                let toUpdate = ['active', 'name', 'custom_roles']
                toUpdate.forEach(item => this.active_workspace[item] = response.data.data.attributes[item])
                for (let [key, value] of Object.entries(this.active_workspace.default_tables)) this.active_workspace.default_tables[key] = response.data.data.attributes.default_tables[key]
                
                console.log("active_workspace: ", this.active_workspace)

                // Actualizare view
                if (redirect_to_dashboard) this.changeView('dashboard')
            }).catch((error) => {
                console.log("error: ", error)
                console.log("error.response: ", error.response)

				// Daca a expirat token-ul
                if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                    alert("Your session expired, please login again!")
                    this.logout()
                } else alert(error.response.data.error.message)
            })
        },
        async fetchActiveWorkspace(){
            console.log("Method: fetchActiveWorkspace()")
            this.changeWorkspace( this.active_workspace.id, false ) // Refresh workspace dar fara change view la dashboard
        },
        async saveWorkspaceSetup(){
            console.log("Method: saveWorkspaceSetup()")

            // Declarare body request
            var requestData = { data: {
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
            console.log("requestData: ", requestData)

            await axios.put(this.apiURL + 'workspaces/' + this.active_workspace.id + '?populate=default_tables', requestData, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                console.log("response: ", response)

                // Actualizare view
                this.changeView('dashboard')

                // Actualizare personal workspace daca e nevoie
                if (this.active_workspace.id == this.user.personal_workspace.id){
                    let toUpdate = ['active', 'name', 'default_tables']
                    toUpdate.forEach(item => this.user.personal_workspace[item] = response.data.data.attributes[item])
                }

                // Actualizare active workspace
                let toUpdate = ['active', 'name', 'default_tables']
                toUpdate.forEach(item => this.active_workspace[item] = response.data.data.attributes[item])
            }).catch((error) => {
                console.log("error: ", error)
                console.log("error.response: ", error.response)

                // Daca a expirat token-ul
                if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                    alert("Your session expired, please login again!")
                    this.logout()
                } else alert(error.response.data.error.message)
            })
        },
        async changeView(view){
            console.log("Method: changeView(" + view + ")")

            // Actualizare view
            this.view = view

            // Cases
            if (view == 'workspaceSettings'){
                console.log("active_workspace: ", this.active_workspace)
                console.log("user.personal_workspace: ", this.user.personal_workspace)
                console.log("workspace_settings: ", this.workspace_settings)

                // Resetare workspace_settings, manage_roles si manage_users
                this.workspace_settings.loading = false
                this.workspace_settings.data.name = this.active_workspace.name
                for (let [key, value] of Object.entries(this.workspace_settings.data.default_tables)) this.workspace_settings.data.default_tables[key] = this.active_workspace.default_tables[key]
                this.manage_roles.new_custom_role_row = false
                this.manage_roles.new_role = {
                    name: null,
                    view_dashboard: false,
                    manage_roles: false,
                    manage_users: false,
                    manage_tables: false,
                    tables_access: { clients: 4, contracts: 4, invoices: 4, products: 4, projects: 4, employees: 4 }
                }
                this.manage_users.invite_user_row = false
                this.manage_users.editing_user = { id: null, new_role: "" }
                this.manage_users.new_user = { email: null, role: "" }

                // Preluare utilizatori
                await axios.get(this.apiURL + 'user-and-workspaces/workspaceUsers/' + this.active_workspace.id, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                    console.log("response: ", response)

                    // Actualizare workspace users
                    this.manage_users.users = response.data
                    console.log("manage_users: ", this.manage_users)
                }).catch((error) => {
                    console.log("error: ", error)
                    console.log("error.response: ", error.response)

                    // Daca a expirat token-ul
                    if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                        alert("Your session expired, please login again!")
                        this.logout()
                    } else alert(error.response.data.error.message)
                })
            } else if (view == 'dashboard'){

            }
        },
        async saveWorkspaceSettings(){
            console.log("Method: saveWorkspaceSettings()")
            console.log("Before Change - active_workspace: ", this.active_workspace)
            console.log("Before Change - workspace_settings: ", this.workspace_settings)

            // Activare loading state
            this.workspace_settings.loading = true

            // Request actualizare nume si/sau default tables
            await axios.put(this.apiURL + 'workspaces/' + this.active_workspace.id + '?populate=default_tables', { data: this.workspace_settings.data }, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                console.log("response: ", response)

                // Actualizare personal workspace daca e nevoie
                if (this.active_workspace.id == this.user.personal_workspace.id){
                    let toUpdate = ['active', 'name', 'default_tables', 'custom_roles']
                    toUpdate.forEach(item => this.user.personal_workspace[item] = response.data.data.attributes[item])
                }
                // Actualizare active workspace
                let toUpdate = ['active', 'name', 'default_tables', 'custom_roles']
                toUpdate.forEach(item => this.active_workspace[item] = response.data.data.attributes[item])

                // Actualizare user workspaces
                if (this.active_workspace.id != this.user.personal_workspace.id){
                    console.log(this.user.workspaces[this.active_workspace.id].name)
                    this.user.workspaces[this.active_workspace.id].name = response.data.data.attributes.name
                }

                // Refresh
                this.changeView('workspaceSettings')
            }).catch((error) => {
                console.log("error: ", error)
                console.log("error.response: ", error.response)

                // Daca a expirat token-ul
                if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                    alert("Your session expired, please login again!")
                    this.logout()
                } else alert(error.response.data.error.message)

                // Dezactivare loading state
                this.workspace_settings.loading = false
            })
        },
        async saveNewCustomRole(){
            console.log("Method: saveNewCustomRole()")
            console.log("manage_roles: ", this.manage_roles)

            // Validare date
            var checkTables = Object.values(this.manage_roles.new_role.tables_access).every((item) => { return item == 4 })
            if(!this.manage_roles.new_role.name) alert ("You forgot to choose a name for the new custom role!")
            else if (checkTables && !this.manage_roles.new_role.view_dashboard && !this.manage_roles.new_role.manage_roles && !this.manage_roles.new_role.manage_users && !this.manage_roles.new_role.manage_tables)
                alert ("Please choose at least one type of right for the new custom role!")
            else {
                // Activare loading state
                this.workspace_settings.loading = true

                // Declarare body request
                var requestData = this.manage_roles.new_role
                requestData.workspaceID = this.active_workspace.id

                await axios.post(this.apiURL + 'workspaces/createCustomRole/', requestData, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                    console.log("response: ", response)

                    // Actualizare active workspace si refresh
                    this.fetchActiveWorkspace()
                    this.changeView('workspaceSettings')
                }).catch((error) => {
                    console.log("error: ", error)
                    console.log("error.response: ", error.response)

                    // Daca a expirat token-ul
                    if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                        alert("Your session expired, please login again!")
                        this.logout()
                    } else alert(error.response.data.error.message)

                    // Dezactivare loading state
                    this.workspace_settings.loading = false
                })
            }
        },
        async deleteRole(role){
            console.log("Method: deleteRole(" + role + ")")

            // Alerta browser
            let confirmAction = confirm("Are you sure you want to remove role '" + role + "'?\nAll users with this role will get the role 'Analyst'.")

            if (confirmAction){
                // Activare loading state
                this.workspace_settings.loading = true

                // Declarare body request
                var requestData = {
                    workspaceID: this.active_workspace.id,
                    roleName: role
                }

                await axios.post(this.apiURL + 'workspaces/deleteCustomRole/', requestData, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                    console.log("response: ", response)

                    // Actualizare active workspace si refresh
                    this.fetchActiveWorkspace()
                    this.changeView('workspaceSettings')
                }).catch((error) => {
                    console.log("error: ", error)
                    console.log("error.response: ", error.response)

                    // Daca a expirat token-ul
                    if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                        alert("Your session expired, please login again!")
                        this.logout()
                    } else alert(error.response.data.error.message)

                    // Dezactivare loading state
                    this.workspace_settings.loading = false
                })
            }
        },
        async kickUser(id){
            console.log("Method: kickUser(" + id + ")")

            // Alerta browser
            let confirmAction = confirm("Are you sure you want to kick '" + this.manage_users.users[id].display_name + "' from the workspace?")

            if (confirmAction){
                // Activare loading state
                this.workspace_settings.loading = true

                await axios.delete(this.apiURL + 'user-and-workspaces/' + this.manage_users.users[id].user_and_workspace, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                    console.log("response: ", response)

                    // Actualizare active workspace si refresh
                    this.fetchActiveWorkspace()
                    this.changeView('workspaceSettings')
                }).catch((error) => {
                    console.log("error: ", error)
                    console.log("error.response: ", error.response)

                    // Daca a expirat token-ul
                    if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                        alert("Your session expired, please login again!")
                        this.logout()
                    } else alert(error.response.data.error.message)

                    // Dezactivare loading state
                    this.workspace_settings.loading = false
                })
            }
        },
        async revokeInvitation(id){
            console.log("Method: revokeInvitation(" + id + ")")

            // Alerta browser
            let confirmAction = confirm("Are you sure you want to revoke the invitation for '" + this.manage_users.users[id].display_name + "'?")

            if (confirmAction){
                // Activare loading state
                this.workspace_settings.loading = true

                // Stergere "pending-" din "id"
                id = parseInt(id.slice(8))
                console.log("id: ", id)

                await axios.delete(this.apiURL + 'pending-invitations/' + id, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                    console.log("response: ", response)

                    // Actualizare active workspace si refresh
                    this.fetchActiveWorkspace()
                    this.changeView('workspaceSettings')
                }).catch((error) => {
                    console.log("error: ", error)
                    console.log("error.response: ", error.response)

                    // Daca a expirat token-ul
                    if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                        alert("Your session expired, please login again!")
                        this.logout()
                    } else alert(error.response.data.error.message)

                    // Dezactivare loading state
                    this.workspace_settings.loading = false
                })
            }
        },
        async sendUserInvitation(){
            console.log("Method: sendUserInvitation()")
            console.log("manage_users: ", this.manage_users)

            // Validare date
            if (!this.manage_users.new_user.role) alert ("Please choose a role for the invited person!")
            else {
                // Activare loading state
                this.workspace_settings.loading = true

                // Declarare body request
                var requestData = { data: {
                    email: this.manage_users.new_user.email,
                    workspace: this.active_workspace.id,
                    role: this.manage_users.new_user.role,
                    invited_by: this.user.id
                } }

                await axios.post(this.apiURL + 'pending-invitations/', requestData, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                    console.log("response: ", response)

                    // Actualizare active workspace si refresh
                    this.fetchActiveWorkspace()
                    this.changeView('workspaceSettings')
                }).catch((error) => {
                    console.log("error: ", error)
                    console.log("error.response: ", error.response)

                    // Daca a expirat token-ul
                    if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                        alert("Your session expired, please login again!")
                        this.logout()
                    } else alert(error.response.data.error.message)

                    // Dezactivare loading state
                    this.workspace_settings.loading = false
                })
            }
        },
        async updateRole(){
            console.log("Method: updateRole()")

            // Preluare date
            var id = this.manage_users.editing_user.id

            // Activare loading state
            this.workspace_settings.loading = true

            // Declarare body request
            var user_and_workspace_ID = this.manage_users.users[id].user_and_workspace
            if (this.manage_users.editing_user.new_role != "manager" && this.manage_users.editing_user.new_role != "analyst"){
                var the_role = "custom"
                var the_custom_role = this.manage_users.editing_user.new_role
            } else {
                var the_role = this.manage_users.editing_user.new_role
                var the_custom_role = null
            }
            var requestData = { data: {
                role: the_role,
                custom_role: the_custom_role
            } }

            await axios.put(this.apiURL + 'user-and-workspaces/' + user_and_workspace_ID, requestData, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                console.log("response: ", response)

                // Actualizare active workspace si refresh
                this.fetchActiveWorkspace()
                this.changeView('workspaceSettings')
            }).catch((error) => {
                console.log("error: ", error)
                console.log("error.response: ", error.response)

                // Daca a expirat token-ul
                if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                    alert("Your session expired, please login again!")
                    this.logout()
                } else alert(error.response.data.error.message)

                // Dezactivare loading state
                this.workspace_settings.loading = false
            })
        },
        async editUser(id){
            console.log("Method: editUser(" + id + ")")

            // Activare edit state
            this.manage_users.editing_user.id = id
        },
        async leaveWorkspace(uawID){
            console.log("Method: leaveWorkspace()")

            console.log("uawID: ", uawID)

            await axios.delete(this.apiURL + 'user-and-workspaces/' + uawID, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                console.log("response: ", response)

                // Eliminare workspace din lista user-ului
                delete this.user.workspaces[this.active_workspace.id]

                // Schimbare active workspace in cel personal
                this.changeWorkspace(this.user.personal_workspace.id)
            }).catch((error) => {
                console.log("error: ", error)
                console.log("error.response: ", error.response)

                // Daca a expirat token-ul
                if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                    alert("Your session expired, please login again!")
                    this.logout()
                } else alert(error.response.data.error.message)
            })
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
                            &.noButtons{
                                padding-right: calc(48px + 60px)
                            }
                            select{
                                font-family: 'Poppins', sans-serif;
                                font-size: 14px;
                                border-radius: 3px;
                                padding: 12px 24px;
                                text-transform: capitalize;

                                &[name="new_role"]{
                                    padding: 0;
                                    border: 0;
                                }
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