<template>
    <div class="as-container">
        <div class="sidemenu">
            <img src="../assets/logo.png" class="as-logo"/>
            <select id="workspace" name="workspace" v-model="active_workspace.id" @change="changeWorkspace(active_workspace.id)">
                <option :value="user.personal_workspace.id">{{ user.personal_workspace.name }}</option>
                <template v-for="(data, id) in user.workspaces">
                    <option v-if="id != user.personal_workspace.id" :value="id">{{ data.name }}</option>
                </template>
            </select>
			<div v-if="active_workspace.active" class="as-separator"></div>
            <div v-if="active_workspace.active" class="workspaceSettings">
                <asButton v-if="view == 'dashboard'" bttnType="third" label="Dashboard" icon="dashboard-main-16.png" iconPosition="left" class="active"/>
                <asButton v-else bttnType="third" label="Dashboard" icon="dashboard-25gray-16.png" iconPosition="left" @click="changeView('dashboard')"/>
                <template v-if="active_workspace.permissions.manage_roles || active_workspace.permissions.manage_users || active_workspace.permissions.manage_tables">
                    <asButton v-if="view == 'workspaceSettings'" bttnType="third" label="Workspace Settings" icon="wrench-main-16.png" iconPosition="left" class="active"/>
                    <asButton v-else bttnType="third" label="Workspace Settings" icon="wrench-25gray-16.png" iconPosition="left" @click="changeView('workspaceSettings')"/>
                </template>
                <asButton v-if="active_workspace.id != user.personal_workspace.id" bttnType="third" label="Leave Workspace" icon="logout-red-16.png" iconPosition="left" @click="leaveWorkspace(user.workspaces[active_workspace.id].user_and_workspace_ID)"/>
            </div>
			<div class="as-separator"></div>
            <div class="menuItems">
                <p v-if="!active_workspace.active" class="setupText">More items will appear here after you finish the setup of this workspace.</p>
                <template v-else>
                    <template v-for="(table, index) in ['clients', 'contracts', 'projects', 'employees', 'invoices', 'products']">
                        <template v-if="active_workspace.default_tables['default_tables_' + table] && active_workspace.permissions.tables_access[table] != 4">
                            <asButton v-if="view == 'table' && viewTable.name == table" bttnType="third" :label="table" icon="table-main-16.png" iconPosition="left" class="active"/>
                            <asButton v-else bttnType="third" :label="table" icon="table-25gray-16.png" iconPosition="left" @click="changeTableView(table)"/>
                        </template>
                    </template>
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
            <div class="screenhead">
                <div class="breadcrumbs">
                    <h5>{{ active_workspace.name }}</h5>
                    <img src="../assets/arrowRight-25gray-16.png"/>
                    <template v-if="view == 'dashboard'">
                        <h5 v-if="!active_workspace.active">Setup</h5>
                        <h5 v-else>Dashboard</h5>
                    </template>
                    <h5 v-else-if="view == 'workspaceSettings'">Workspace Settings</h5>
                    <h5 v-else-if="view == 'table' || view == 'entry'">{{ viewTable.name }}</h5>
                    <template v-if="view == 'entry'"><img src="../assets/arrowRight-25gray-16.png"/><h5>{{ viewEntry.id }}</h5></template>
                </div>
                <template v-if="active_workspace.permissions.tables_access[viewTable.name] < 3">
                    <asButton bttnType="secondary" label="Add New Entry" icon="plus-white-16.png" v-if="view == 'table'" @click="addNewEntry(this.viewTable.name)"/>
                    <asButton bttnType="secondary" label="Edit Entry" icon="edit-white-16.png" v-if="view == 'entry'" @click="toggleEditEntry()"/>
                    <asButton bttnType="secondary" label="Delete Entry" icon="delete-white-16.png" v-if="view == 'entry'" @click="deleteEntry(this.viewEntry.id, this.viewTable.name)"/>
                </template>
            </div>
            <div v-if="view == 'dashboard'" class="view-dashboard">
                <template v-if="!active_workspace.permissions.view_dashboard">
                    <p>You don't have access to the workspace's dashboard. Please select a table from left menu.</p>
                </template>
                <template v-else>
                    <template v-if="!active_workspace.active">
                        <form v-if="user.workspaces[active_workspace.id].role== 'owner'" class="setupSection" v-on:submit.prevent="saveWorkspaceSetup()">
                            <div class="sectionBox">
                                <h5><span style="color: var(--main)">A.</span> Before starting, we’ll need to configure a few things first:</h5>
                                <div class="as-separator"></div>
                                <asField label="A.1. Workspace Name" icon="folder-main-16.png" type="text" placeholder="Choose a short and friendly name" name="workspace_name" v-model="active_workspace.name" required/>
                                <div class="workspace-default-tables">
                                    <p>A.2. Choose Initial tables <span style="color: var(--50-gray)">(after setup you will be able to add custom others too)</span></p>
                                    <label><input type="checkbox" name="defaultTables[]" value="default_tables_clients" v-model="active_workspace.default_tables.default_tables_clients"><p>Clients</p></label>
                                    <label><input type="checkbox" name="defaultTables[]" value="default_tables_contracts" v-model="active_workspace.default_tables.default_tables_contracts"><p>Contracts</p></label>
                                    <label><input type="checkbox" name="defaultTables[]" value="default_tables_projects" v-model="active_workspace.default_tables.default_tables_projects"><p>Projects</p></label>
                                    <label><input type="checkbox" name="defaultTables[]" value="default_tables_employees" v-model="active_workspace.default_tables.default_tables_employees"><p>Employees</p></label>
                                    <label><input type="checkbox" name="defaultTables[]" value="default_tables_invoices" v-model="active_workspace.default_tables.default_tables_invoices"><p>Invoices</p></label>
                                    <label><input type="checkbox" name="defaultTables[]" value="default_tables_products" v-model="active_workspace.default_tables.default_tables_products"><p>Products</p></label>
                                </div>
                            </div>
                            <asButton bttnType="main" icon="arrowRight-white-16.png" label="Save Workspace" :disabled="setupFormReady"/>
                        </form>
                        <p v-else>This workspace is not configured yet. Contact the owner or choose another workspace from left menu.</p>
                    </template>
                </template>
            </div>
            <div v-if="view == 'workspaceSettings'" class="view-workspaceSettings" :class="{ 'loading' : workspace_settings.loading }">
                <div class="sectionBox sb-workspacesettings" v-if="active_workspace.permissions.manage_tables">
                    <div class="sectionBoxHead">
                        <h5>Workspace Settings</h5>
                        <asButton bttnType="main" label="Save changes" icon="save-white-16.png" @click="saveWorkspaceSettings()"/>
                    </div>
                    <div class="as-separator"></div>
                    <template v-if="user.workspaces[active_workspace.id].role == 'owner'">
                        <div class="row">
                            <asField label="Change workspace name" icon="folder-main-16.png" type="text" placeholder="Choose a short and friendly name" name="workspace_settings_name" v-model="workspace_settings.data.name" required/>
                            <!-- <div class="unlock-all-entries">
                                <p>Did an entry blocked?</p>
                                <asButton bttnType="secondary" label="Unlock all entries" icon="unlock-white-16.png" disabled/>
                            </div> -->
                        </div>
                        <div class="as-separator"></div>
                    </template>
                    <div class="manage-default-tables">
                        <p>Enable or disable default tables <span style="color: var(--50-gray)">(disabling an enabled table won’t remove any data)</span></p>
                        <label><input type="checkbox" name="workspace_settings_defaultTables[]" value="workspace_settings_default_tables_clients" v-model="workspace_settings.data.default_tables.default_tables_clients"><p>Clients</p></label>
                        <label><input type="checkbox" name="workspace_settings_defaultTables[]" value="workspace_settings_default_tables_contracts" v-model="workspace_settings.data.default_tables.default_tables_contracts"><p>Contracts</p></label>
                        <label><input type="checkbox" name="workspace_settings_defaultTables[]" value="workspace_settings_default_tables_projects" v-model="workspace_settings.data.default_tables.default_tables_projects"><p>Projects</p></label>
                        <label><input type="checkbox" name="workspace_settings_defaultTables[]" value="workspace_settings_default_tables_employees" v-model="workspace_settings.data.default_tables.default_tables_employees"><p>Employees</p></label>
                        <label><input type="checkbox" name="workspace_settings_defaultTables[]" value="workspace_settings_default_tables_invoices" v-model="workspace_settings.data.default_tables.default_tables_invoices"><p>Invoices</p></label>
                        <label><input type="checkbox" name="workspace_settings_defaultTables[]" value="workspace_settings_default_tables_products" v-model="workspace_settings.data.default_tables.default_tables_products"><p>Products</p></label>
                    </div>
                </div>
                <div class="sectionBox sb-manageroles" v-if="active_workspace.permissions.manage_roles">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <form class="sectionBox sb-manageusers" v-on:submit.prevent="sendUserInvitation()" v-if="active_workspace.permissions.manage_users">
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
            <div v-if="view == 'table'" class="view-table">
                 <div class="table">
                        <div class="tableHead">
                            <p v-for="(label, name) in viewTable.structure[viewTable.name]" class="tableHeadItem">{{ label }}</p>
                        </div>
                        <div class="tableRows">
                            <p v-if="viewTable.content.length == 0" class="table-no-content">There is no content inside this table.</p>
                            <template v-else>
                                <div class="tableRow" v-for="(data, id) in viewTable.content" :key="id">
                                    <div class="rowButtons">
                                        <img src="../assets/icBttn-mainGlass-25gray-see.png" @click="seeEntry(id)">
                                    </div>
                                    <template v-for="(value, name) in data">
                                        <p v-if="value === true">Yes</p>
                                        <p v-else-if="value === false">No</p>
                                        <template v-else-if="typeof value === 'object'">
                                            <p v-for="item in value">{{ item }}</p>
                                        </template>
                                        <template v-else>
                                            <p>{{ value }} <template v-if="['project_value', 'invoice_total', 'product_unit_value'].includes(name)">EUR</template></p>
                                        </template>
                                    </template>
                                </div>
                            </template>
                        </div>
                 </div>
            </div>
            <div v-if="view == 'entry'" class="view-entry">
                <div class="left">
                    <div class="sectionBox boxtype1">
                        <h5>Entry details</h5><div class="as-separator"></div>
                        <div class="entryFields">
                            <template v-for="item in viewEntry.structure[viewTable.name].fields">
                                <template v-if="item.composed && viewEntry.content[item.name] != null">
                                    <!-- <br><br><br>{{ item }} -->
                                    <template v-if="item.name == 'id'">
                                        <asField background="#F7F7F7" type="text" :name="item.name" :label="item.label" :modelValue="viewEntry.content.id" placeholder="No data here" :required="item.required" disabled/>
                                    </template><template v-else-if="item.type == 'number'">
                                        <asField background="#F7F7F7" type="number" :name="item.name" :label="item.label" :modelValue="viewEntry.content[item.name][item.name2]" placeholder="No data here" :required="item.required" disabled/>
                                    </template><template v-else-if="item.type == 'text'">
                                        <asField background="#F7F7F7" type="text" :name="item.name" :label="item.label" :modelValue="viewEntry.content[item.name][item.name2]" placeholder="No data here" :required="item.required" disabled/>
                                    </template><template v-else-if="item.type == 'toggle'">
                                        <asField background="#F7F7F7" type="text" :name="item.name" :label="item.label" :modelValue="viewEntry.content[item.name][item.name2] == true ? 'Yes' : 'No'" placeholder="No data here" :required="item.required" disabled/>
                                    </template><template v-else-if="item.type == 'email'">
                                        <asField background="#F7F7F7" type="email" :name="item.name" :label="item.label" :modelValue="viewEntry.content[item.name][item.name2]" placeholder="No data here" :required="item.required" disabled/>
                                    </template><template v-else-if="item.type == 'date'">
                                        <asField background="#F7F7F7" type="date" :name="item.name" :label="item.label" :modelValue="viewEntry.content[item.name][item.name2]" placeholder="No data here" :required="item.required" disabled/>
                                    </template><template v-else-if="item.type == 'dropdown'">
                                        <asField background="#F7F7F7" type="text" :name="item.name" :label="item.label" :modelValue="viewEntry.content[item.name][item.name2]" placeholder="No data here" :required="item.required" disabled/>
                                    </template><template v-else-if="item.type == 'currency'">
                                        <asField background="#F7F7F7" type="text" :name="item.name" :label="item.label" :modelValue="viewEntry.content[item.name][item.name2] + ' EUR'" placeholder="No data here" :required="item.required" disabled/>
                                    </template>
                                </template><template v-else-if="!item.composed">
                                    <!-- <br><br><br>{{ item }} -->
                                     <template v-if="item.name == 'id'">
                                        <asField background="#F7F7F7" type="text" :name="item.name" :label="item.label" :modelValue="viewEntry.content.id" placeholder="No data here" :required="item.required" disabled/>
                                    </template><template v-else-if="item.type == 'text'">
                                        <asField background="#F7F7F7" type="text" :name="item.name" :label="item.label" :modelValue="viewEntry.content[item.name]" placeholder="No data here" :required="item.required" disabled/>
                                    </template><template v-else-if="item.type == 'email'">
                                        <asField background="#F7F7F7" type="email" :name="item.name" :label="item.label" :modelValue="viewEntry.content[item.name]" placeholder="No data here" :required="item.required" disabled/>
                                    </template><template v-else-if="item.type == 'number'">
                                        <asField background="#F7F7F7" type="number" :name="item.name" :label="item.label" :modelValue="viewEntry.content[item.name]" placeholder="No data here" :required="item.required" disabled/>
                                    </template><template v-else-if="item.type == 'toggle'">
                                        <asField background="#F7F7F7" type="text" :name="item.name" :label="item.label" :modelValue="viewEntry.content[item.name] == true ? 'Yes' : 'No'" placeholder="No data here" :required="item.required" disabled/>
                                    </template><template v-else-if="item.type == 'date'">
                                        <asField background="#F7F7F7" type="date" :name="item.name" :label="item.label" :modelValue="viewEntry.content[item.name]" placeholder="No data here" :required="item.required" disabled/>
                                    </template><template v-else-if="item.type == 'dropdown'">
                                        <asField background="#F7F7F7" type="text" :name="item.name" :label="item.label" :modelValue="viewEntry.content[item.name]" placeholder="No data here" :required="item.required" disabled/>
                                    </template><template v-else-if="item.type == 'currency'">
                                        <asField background="#F7F7F7" type="text" :name="item.name" :label="item.label" :modelValue="viewEntry.content[item.name] + ' EUR'" placeholder="No data here" :required="item.required" disabled/>
                                    </template>
                                </template>
                            </template>
                        </div>
                    </div>
                    <div v-if="viewEntry.structure[viewTable.name].mainRelation && active_workspace.permissions.tables_access[viewEntry.structure[viewTable.name].mainRelation.table + 's'] < 4" class="sectionBox boxtype2">
                        <div class="sectionBoxHead">
                            <h5>{{ viewEntry.structure[viewTable.name].singular }}'s {{ viewEntry.structure[viewTable.name].mainRelation.table }}</h5>
                            <template v-if="active_workspace.permissions.tables_access[viewTable.name] < 4">
                                <asButton bttnType="third" :label="'See ' + viewEntry.structure[viewTable.name].mainRelation.table + ' entry'" icon="see-25gray-16.png" @click="seeEntry(viewEntry.content[viewEntry.structure[viewTable.name].singularandlower + '_' + viewEntry.structure[viewTable.name].mainRelation.table].data.id, viewEntry.structure[viewTable.name].mainRelation.table + 's')"/>
                                <asButton bttnType="third" :label="'Change ' + viewEntry.structure[viewTable.name].mainRelation.table" icon="edit-25gray-16.png" @click="toggleEditField(viewEntry.structure[viewTable.name].singular + '_' + viewEntry.structure[viewTable.name].mainRelation.table)"/>
                            </template>
                        </div>
                        <div class="as-separator"></div>
                        <div class="entryFields">
                            <template v-for="item in viewEntry.structure[viewTable.name].mainRelation.fields" v-if="viewEntry.content[viewEntry.structure[viewTable.name].singularandlower + '_' + viewEntry.structure[viewTable.name].mainRelation.table] != null">
                                <asField v-if="item.type == 'toggle'" background="#F7F7F7" type="text" :name="item.name" :label="item.label" :modelValue="viewEntry.content[viewEntry.structure[viewTable.name].singularandlower + '_' + viewEntry.structure[viewTable.name].mainRelation.table].data.attributes[item.name] == true ? 'Yes' : 'No'" placeholder="No data here" required disabled/>
                                <asField v-else-if="item.type == 'currency'" background="#F7F7F7" type="text" :name="item.name" :label="item.label" :modelValue="viewEntry.content[viewEntry.structure[viewTable.name].singularandlower + '_' + viewEntry.structure[viewTable.name].mainRelation.table].data.attributes[item.name] + ' EUR'" placeholder="No data here" required disabled/>
                                <asField v-else-if="item.name == 'id'" background="#F7F7F7" type="text" :name="item.name" :label="item.label" :modelValue="viewEntry.content[viewEntry.structure[viewTable.name].singularandlower + '_' + viewEntry.structure[viewTable.name].mainRelation.table].data.id" placeholder="No data here" required disabled/>
                                <asField v-else background="#F7F7F7" type="text" :name="item.name" :label="item.label" :modelValue="viewEntry.content[viewEntry.structure[viewTable.name].singularandlower + '_' + viewEntry.structure[viewTable.name].mainRelation.table].data.attributes[item.name]" placeholder="No data here" required disabled/>
                            </template>
                        </div>
                    </div>
                    <template v-for="item in viewEntry.structure[viewTable.name].otherRelations">
                        <div v-if="item.table == 'task' || item.table == 'item' || active_workspace.permissions.tables_access[item.table + 's'] < 4" class="sectionBox boxtype3">
                            <div class="sectionBoxHead">
                                <h5>{{ viewEntry.structure[viewTable.name].singular }}'s {{ item.table }}(s)</h5>
                                <asButton v-if="active_workspace.permissions.tables_access[viewTable.name] < 3 && !item.prefill" bttnType="third" :label="'Add new ' + item.table" icon="plus-25gray-16.png" @click="addNewEntry(item.table + 's')"/>
                                <asButton v-else-if="active_workspace.permissions.tables_access[viewTable.name] < 3 && item.prefill" bttnType="third" :label="'Add new ' + item.table" icon="plus-25gray-16.png" @click="addNewEntry(item.table + 's', item.prefill, viewEntry.id)"/>
                            </div>
                            <div class="table">
                                <div class="tableHead">
                                <p v-for="field in item.fields" class="tableHeadItem grow">{{ field.label }}</p>
                                </div>
                                <div class="tableRows" v-if="viewEntry.content[viewEntry.structure[viewTable.name].singularandlower + '_' + item.table + 's']">
                                    <div v-for="subitem in viewEntry.content[viewEntry.structure[viewTable.name].singularandlower + '_' + item.table + 's'].data" class="tableRow">  
                                        <div class="rowButtons" v-if="!item.special">
                                            <img src="../assets/icBttn-mainGlass-25gray-see.png" @click="seeEntry(subitem.id, item.table + 's')">
                                        </div><div class="rowButtons" v-else>
                                            <img src="../assets/icBttn-mainGlass-25gray-delete.png" @click="deleteEntry(subitem.id, 'special')">
                                        </div>
                                        <template v-for="field in item.fields">
                                            <template v-if="field.composed">
                                                <!-- {{ subitem.attributes }} -->
                                                <p class="grow">{{ subitem.attributes[field.name].data.attributes[field.name2] }}<template v-if="field.type == 'currency'"> EUR</template></p>
                                            </template><template v-else>
                                                <p v-if="field.name == 'id'" class="grow">{{ subitem.id }}</p>
                                                <p v-else-if="field.type == 'toggle'" class="grow toggle" @click="switchToggle(subitem.id, field.name, subitem.attributes[field.name])">{{ subitem.attributes[field.name] == true ? 'Yes' : 'No' }}</p>
                                                <p v-else class="grow">{{ subitem.attributes[field.name] }}<template v-if="field.type == 'currency'"> EUR</template></p>
                                            </template>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="right">
                    <div class="sectionBox">
                        <h5>Entry discussions</h5>
                        <div class="as-separator"></div>
                        <div class="commentsList">
                            <div v-if="viewEntry.content.discussions" v-for="item in viewEntry.content.discussions.slice().reverse()" class="commentBox" :class="{ 'personal' : item.comment_user.data.id == user.id }">
                                <div class="commentTop">
                                    <p>{{ item.comment_user.data.attributes.display_name }}</p>
                                    <p>{{ new Date(item.comment_date).toLocaleString().slice(0, -3) }}</p>
                                </div>
                                <p>{{ item.comment_text }}</p>
                            </div>
                        </div>
                        <div class="as-separator"></div>
                        <form class="leaveComment" v-on:submit.prevent="submitComment()">
                            <asField type="text" name="commentText" label="Leave a comment" placeholder="What's your message?" required/>
                            <asButton bttnType="main" icon="arrowRight-white-16.png" label="Submit comment"/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <asAccountSettings v-if="accountSettings" @closeAccountSettings="accountSettings = false"/>
    <div class="modal-overlay" id="addNewEntry" v-if="newEntry.visible">
        <div class="modal-container">
            <div class="modal-head">
                <h3><span class="tableTitle">{{ newEntry.table }}</span> - Add new entry</h3>
                <img src="../assets/close-main-20.png" @click="addNewEntry('close')"/>
            </div>
            <div class="as-separator"></div>
            <form v-on:submit.prevent="submitNewEntry(newEntry.table, newEntry.middleTable[newEntry.table])" :class="{ 'loading' : newEntry.loading }">
                <template v-for="item in newEntry.structure[newEntry.table]">
                    <template v-if="!item.ifTable || item.ifTable && item.ifTable == viewTable.name">
                        <div class="asField" v-if="item.type == 'toggle'">
                            <label>{{ item.label }}<span style="color: var(--accent)"> (optional)</span></label>
                            <select :name="item.name">
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div><div class="asField" v-else-if="item.type == 'select'">
                            <label>{{ item.label }}<span style="color: var(--accent)"> *</span></label>
                            <select :name="item.name">
                                <option v-for="option in item.options" :value="option">{{ option }}</option>
                            </select>
                        </div><div class="asField" v-else-if="item.type == 'relation'">
                                <label>{{ item.label }}<span style="color: var(--accent)"> *</span></label>
                                <select :name="item.name">
                                    <option v-for="item in newEntry.mainRelationOptions" :value="item.id">{{ item.name }}</option>
                                </select>
                        </div>
                        <asField v-else-if="item.name == 'client_cui'" @change="getDataFromCUI()" :label="item.label" :type="item.type" :placeholder="item.label" :name="item.name" :required="item.required"/>
                        <asField v-else :label="item.label" :type="item.type" :placeholder="item.label" :name="item.name" :required="item.required" :min="item.type == 'number' ? 0.01 : 0" :step="item.type == 'number' ? 0.01 : 1"/>
                    </template>
                </template>
                <div class="as-separator"></div>
                <div class="formEnd">
                    <template v-if="newEntry.loading == false">
                        <asButton bttnType="secondary" label="Cancel" icon="block-white-16.png" @click="addNewEntry('close')"/>
                        <asButton bttnType="main" label="Save" icon="save-white-16.png"/>
                    </template>
                    <asButton v-else bttnType="loading" label="Please wait..." icon="loading.gif" disabled/>
                </div>
            </form>
        </div>
    </div>
    <div class="modal-overlay" id="editEntry" v-if="editEntry.visible">
        <div class="modal-container">
            <div class="modal-head">
                <h3>Edit entry</h3>
                <img src="../assets/close-main-20.png" @click="toggleEditEntry('close')"/>
            </div>
            <div class="as-separator"></div>
            <form v-on:submit.prevent="submitEditEntry()">
                
            </form>
        </div>
    </div>
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
            redirect: false,
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
                        default_tables_projects: null,
                        default_tables_employees: null,
                        default_tables_invoices: null,
                        default_tables_products: null,
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
                    default_tables_projects: null,
                    default_tables_employees: null,
                    default_tables_invoices: null,
                    default_tables_products: null,
                },
                custom_roles: null,
                permissions: {
                    view_dashboard: false,
                    manage_roles: false,
                    manage_users: false,
                    manage_tables: false,
                    tables_access: {
                        clients: 4,
                        contracts: 4,
                        projects: 4,
                        employees: 4,
                        invoices: 4,
                        products: 4,
                    }
                }
            },
            view: "dashboard",
            viewTable: {
                name: null,
                content: [],
                structure: {
                    clients: {
                        "client_cui": "CUI",
                        "client_name": "Name",
                        "client_contact_person[person_name]": "Contact Name",
                        "client_contact_person[person_email]": "Contact Email",
                        "client_vat_payer": "VAT Payer"
                    },
                    contracts: {
                        "id": "Contract Number",
                        "contract_date": "Contract Date",
                        "contract_status": "Status",
                        "contract_client[findDeep][client_name]": "Client",
                    },
                    projects: {
                        "project_name": "Name",
                        "project_status": "Status",
                        "project_deadline": "Deadline",
                        "project_value": "Value",
                        "project_contract[findDeep][id]": "Contract Number"
                    },
                    employees: {
                        "employee_name": "Name",
                        "employee_cnp": "CNP"
                    },
                    invoices: {
                        "id": "Invoice number",
                        "invoice_issue_date": "Issue Date",
                        "invoice_due_date": "Due Date",
                        "invoice_project[findDeep][project_name]": "Project",
                        "invoice_total": "Value",
                        "invoice_paid": "Paid"
                    },
                    products: {
                        "id": "Product ID",
                        "product_name": "Name",
                        "product_quantity_unit": "Quantity Unit",
                        "product_unit_value": "Unit Value",
                    },
                }
            },
            newEntry: {
                visible: false,
                loading: false,
                table: null,
                mainRelationOptions: [],
                middleTable:{
                    tasks: "project-",
                    items: "invoice-"
                },
                structure: {
                    clients: [
                        { type: 'number',   name: 'client_cui',                         label: 'Client CUI',                    required: true },
                        { type: 'text',     name: 'client_name',                        label: 'Client name',                   required: true },
                        { type: 'text',     name: 'client_trade_register_number',       label: 'Client trade register number',  required: true },
                        { type: 'text',     name: 'client_address',                     label: 'Client address',                required: true },
                        { type: 'text',     name: 'client_iban',                        label: 'Client IBAN',                   required: false },
                        { type: 'toggle',   name: 'client_vat_payer',                   label: 'Client VAT payer',              required: true },
                        { type: 'text',     name: 'client_contact_person.person_name',  label: 'Client contact name',           required: false },
                        { type: 'email',    name: 'client_contact_person.person_email', label: 'Client contact email',          required: false },
                        { type: 'text',     name: 'client_contact_person.person_phone', label: 'Client contact phone',          required: false },
                    ],
                    contracts: [
                        { type: 'date',     name: 'contract_date',                      label: 'Contract date',                 required: true },
                        { type: 'select',   name: 'contract_status',                    label: 'Contract status',               required: true, options: ['Draft', 'Active', 'Inactive'] },
                        { type: 'relation', name: 'contract_client',                    label: 'Contract client',               required: true },
                    ],
                    projects: [
                        { type: 'text',     name: 'project_name',                       label: 'Project name',                  required: true },
                        { type: 'select',   name: 'project_status',                     label: 'Project status',                required: true, options: ['Planned', 'In-progress', 'Done'] },
                        { type: 'date',     name: 'project_deadline',                   label: 'Project deadline',              required: true },
                        { type: 'number',   name: 'project_value',                      label: 'Project value (in EUR)',        required: true },
                        { type: 'relation', name: 'project_contract',                   label: 'Project contract',              required: true },
                    ],
                    employees: [
                        { type: 'text',     name: 'employee_name',                      label: 'Employee name',                 required: true },
                        { type: 'number',   name: 'employee_cnp',                       label: 'Employee CNP',                  required: true },
                    ],
                    invoices: [
                        { type: 'date',     name: 'invoice_issue_date',                 label: 'Invoice issue date',            required: true },
                        { type: 'date',     name: 'invoice_due_date',                   label: 'Invoice due date',              required: true },
                        { type: 'relation', name: 'invoice_project',                    label: 'Project',                       required: true },
                    ],
                    products: [
                        { type: 'text',     name: 'product_name',                       label: 'Product name',                  required: true },
                        { type: 'text',     name: 'product_description',                label: 'Product description',           required: false },
                        { type: 'text',     name: 'product_quantity_unit',              label: 'Product measuring unit',        required: true },
                        { type: 'number',   name: 'product_unit_value',                 label: 'Product unit value (in EUR)',   required: true },
                    ],
                    tasks: [
                        { type: 'relation', name: 'task_employee',                      label: 'Assignee',                      required: true, ifTable: 'projects' },
                        { type: 'relation', name: 'task_project',                       label: 'Project',                       required: true, ifTable: 'employees' },
                        { type: 'text',     name: 'task_description',                   label: 'Task description',              required: true },
                        { type: 'date',     name: 'task_deadline',                      label: 'Task deadline',                 required: true },
                    ],
                    items: [
                        { type: 'relation', name: 'item_product',                       label: 'Product',                       required: true },
                        { type: 'number',   name: 'item_quantity',                      label: 'Quantity',                      required: true },
                    ]
                }
            },
            editEntry: {
                visible: false
            },
            viewEntry: {
                id: null,
                structure: {
                    clients: {
                        singular: 'Client',
                        singularandlower: 'client',
                        fields: [
                            { name: 'client_cui', label: 'Client CUI', type: 'number', required: true, },
                            { name: 'client_name', label: 'Client name', type: 'text', required: true, },
                            { name: 'client_trade_register_number', label: 'Client trade register number', type: 'text', required: true },
                            { name: 'client_address', label: 'Client address', type: 'text', required: true, },
                            { name: 'client_iban', label: 'Client IBAN', type: 'text', },
                            { name: 'client_vat_payer', label: 'Client VAT payer', type: 'toggle', required: true, },
                            { name: 'client_contact_person', name2: 'person_name', label: 'Client contact name', type: 'text', composed: true, },
                            { name: 'client_contact_person', name2: 'person_email', label: 'Client contact email', type: 'email', composed: true, },
                            { name: 'client_contact_person', name2: 'person_phone', label: 'Client contact phone', type: 'text', composed: true, },
                        ],
                        otherRelations: [
                            {
                                table: 'contract',
                                prefill: 'contract_client',
                                fields: [
                                    { name: 'id', label: 'Contract number', type: 'disabled' },
                                    { name: 'contract_date', label: 'Contract date', type: 'date' },
                                    { name: 'contract_status', label: 'Contract status', type: 'dropdown' }
                                ]
                            }
                        ],
                    },
                    contracts: {
                        singular: 'Contract',
                        singularandlower: 'contract',
                        fields: [
                            { name: 'id', label: 'Contract number', type: 'disabled', required: true, },
                            { name: 'contract_date', label: 'Contract date', type: 'date', required: true, },
                            { name: 'contract_status', label: 'Contract status', type: 'dropdown', required: true, }
                        ],
                        mainRelation: {
                            table: 'client',
                            fields: [
                                { name: 'client_cui', label: 'Client CUI' },
                                { name: 'client_name', label: 'Client name' },
                                { name: 'client_trade_register_number', label: 'Client trade register number' },
                                { name: 'client_address', label: 'Client address' },
                                { name: 'client_iban', label: 'Client IBAN' },
                                { name: 'client_vat_payer', label: 'Client VAT payer', type: 'toggle' }
                            ],
                        },
                        otherRelations: [
                            {
                                table: 'project',
                                prefill: 'project_contract',
                                fields: [
                                    { name: 'project_name', label: 'Project name', type: 'text', },
                                    { name: 'project_status', label: 'Project status', type: 'dropdown', },
                                    { name: 'project_deadline', label: 'Project deadline', type: 'date', },
                                    { name: 'project_value', label: 'Project value', type: 'currency', }
                                ]
                            }
                        ]
                    },
                    projects: {
                        singular: 'Project',
                        singularandlower: 'project',
                        fields: [
                            { name: 'project_name', label: 'Project name', type: 'text', required: true, },
                            { name: 'project_status', label: 'Project status', type: 'dropdown', required: true, },
                            { name: 'project_deadline', label: 'Project deadline', type: 'date', required: true, },
                            { name: 'project_value', label: 'Project value', type: 'disabled', required: true, }
                        ],
                        mainRelation: {
                            table: 'contract',
                            fields: [
                                { name: 'id', label: 'Contract number' },
                                { name: 'contract_date', label: 'Contract date' },
                                { name: 'contract_status', label: 'Contract status' },
                            ],
                        },
                        otherRelations: [
                            {
                                table: 'invoice',
                                prefill: 'invoice_project',
                                fields: [
                                    { name: 'id', label: 'Invoice number', type: 'disabled', },
                                    { name: 'invoice_issue_date', label: 'Issue date', type: 'date', },
                                    { name: 'invoice_due_date', label: 'Due date', type: 'date', },
                                    { name: 'invoice_total', label: 'Invoice total', type: 'currency', },
                                    { name: 'invoice_paid', label: 'Invoice paid', type: 'toggle', },
                                    { name: 'invoice_paid_date', label: 'Paid date', type: 'date', },
                                ]
                            },
                            {
                                table: 'task',
                                special: true,
                                fields: [
                                    { name: 'task_description', label: 'Task description', type: 'text', },
                                    { name: 'task_deadline', label: 'Deadline', type: 'date', },
                                    { name: 'task_done', label: 'Task done', type: 'toggle', },
                                    { name: 'task_employee', name2: 'employee_name', label: 'Employee', type: 'text', composed: true },
                                ]
                            }
                        ]
                    },
                    employees: {
                        singular: 'Employee',
                        singularandlower: 'employee',
                        fields: [
                            { name: 'employee_name', label: 'Employee name', type: 'text', required: true, },
                            { name: 'employee_cnp', label: 'Employee CNP', type: 'text', required: true, },
                        ],
                        otherRelations: [
                            {
                                table: 'task',
                                special: true,
                                fields: [
                                    { name: 'task_description', label: 'Task description', type: 'text', },
                                    { name: 'task_deadline', label: 'Deadline', type: 'date', },
                                    { name: 'task_done', label: 'Task done', type: 'toggle', }
                                ]
                            }
                        ]
                    },
                    invoices: {
                        singular: 'Invoice',
                        singularandlower: 'invoice',
                        fields: [
                            { name: 'id', label: 'Invoice number', type: 'disabled', required: true, },
                            { name: 'invoice_issue_date', label: 'Issue date', type: 'date', required: true, },
                            { name: 'invoice_due_date', label: 'Due date', type: 'date', required: true, },
                            { name: 'invoice_total', label: 'Invoice total', type: 'currency', required: true, },
                            { name: 'invoice_paid', label: 'Invoice paid', type: 'toggle', },
                            { name: 'invoice_paid_date', label: 'Paid date', type: 'date', },
                        ],
                        mainRelation: {
                            table: 'project',
                            fields: [
                                { name: 'project_name', label: 'Project name' },
                                { name: 'project_status', label: 'Project status' },
                                { name: 'project_deadline', label: 'Project deadline' },
                                { name: 'project_value', label: 'Project value', type: 'currency' }
                            ],
                        },
                        otherRelations: [
                            {
                                table: 'item',
                                special: true,
                                fields: [
                                    { name: 'item_product', name2: 'product_name', label: 'Product name', type: 'text', composed: true },
                                    { name: 'item_quantity',label: 'Quantity', type: 'number' },
                                    { name: 'item_product', name2: 'product_quantity_unit', label: 'M.U.', type: 'text', composed: true },
                                    { name: 'item_product', name2: 'product_unit_value', label: 'Unit value', type: 'currency', composed: true },
                                ]
                            }
                        ]
                    },
                    products: {
                        singular: 'Product',
                        singularandlower: 'product',
                        fields: [
                            { name: 'id', label: 'Product ID', type: 'disabled', required: true },
                            { name: 'product_name', label: 'Product name', type: 'text', required: true },
                            { name: 'product_description', label: 'Product description', type: 'text', required: true },
                            { name: 'product_quantity_unit', label: 'Product quantity unit', type: 'text', required: true },
                            { name: 'product_unit_value', label: 'Product unit value', type: 'currency', required: true },
                        ],
                    }
                },
                content: {},
            },
            accountSettings: false,
            workspace_settings: {
                loading: false,
                data: {
                    name: null,
                    default_tables: {
                        default_tables_clients: null,
                        default_tables_contracts: null,
                        default_tables_projects: null,
                        default_tables_employees: null,
                        default_tables_invoices: null,
                        default_tables_products: null,
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
                        projects: 4,
                        employees: 4,
                        invoices: 4,
                        products: 4,
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
        // await this.fetchUser() // Preluare date user
        // await this.fetchPersonalWorkspace() // Preluare date workspace personal

        await this.fetchUser().then(async () => { // Preluare date user
            if (!this.redirect) await this.fetchPersonalWorkspace().then(async () => { // Preluare date workspace personal
                // Setare workspace default in router-view
                if(this.$route.params.fromInvitation){
                    console.log('Coming from an invitation registration')
                    await this.changeWorkspace ( this.$route.params.fromInvitation )
                } else await this.changeWorkspace( this.user.personal_workspace.id )
            })
        })
        
        // // Setare workspace default in router-view
        // if(this.$route.params.fromInvitation){
        //     console.log('Coming from an invitation registration')
        //     await this.changeWorkspace ( this.$route.params.fromInvitation )
        // } else await this.changeWorkspace( this.user.personal_workspace.id )
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
            await axios.get(this.apiURL + 'user-and-workspaces/?populate=*&filters[user][id][$eq]=' + this.user.id, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
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
            this.redirect = true
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

                // Actualizare ce poate vedea user-ul
                var switch_toUpdate1, switch_toUpdate2 = []
                switch (this.user.workspaces[this.active_workspace.id].role){
                    case "owner":
                        switch_toUpdate1 = ['view_dashboard', 'manage_roles', 'manage_users', 'manage_tables']
                        switch_toUpdate1.forEach(item => this.active_workspace.permissions[item] = true)
                        switch_toUpdate2 = ['clients', 'contracts', 'projects', 'employees', 'invoices', 'products']
                        switch_toUpdate2.forEach(item => this.active_workspace.permissions.tables_access[item] = 2)
                        break
                    case "manager":
                        switch_toUpdate1 = ['view_dashboard', 'manage_roles', 'manage_users', 'manage_tables']
                        switch_toUpdate1.forEach(item => this.active_workspace.permissions[item] = true)
                        switch_toUpdate2 = ['clients', 'contracts', 'projects', 'employees', 'invoices', 'products']
                        switch_toUpdate2.forEach(item => this.active_workspace.permissions.tables_access[item] = 2)
                        break
                    case "analyst":
                        switch_toUpdate1 = ['manage_roles', 'manage_users', 'manage_tables']
                        switch_toUpdate1.forEach(item => this.active_workspace.permissions[item] = false)
                        this.active_workspace.permissions.view_dashboard = true
                        switch_toUpdate2 = ['clients', 'contracts', 'projects', 'employees', 'invoices', 'products']
                        switch_toUpdate2.forEach(item => this.active_workspace.permissions.tables_access[item] = 4)
                        break
                    case "custom":
                        this.active_workspace.permissions = this.active_workspace.custom_roles[this.user.workspaces[this.active_workspace.id].custom_role]
                        break
                }
                
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
                    "default_tables_projects": this.active_workspace.default_tables.default_tables_projects,
                    "default_tables_employees": this.active_workspace.default_tables.default_tables_employees,
                    "default_tables_invoices": this.active_workspace.default_tables.default_tables_invoices,
                    "default_tables_products": this.active_workspace.default_tables.default_tables_products,
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
                    tables_access: { clients: 4, contracts: 4, projects: 4, employees: 4, invoices: 4, products: 4 }
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
        async changeTableView(table_name){
            console.log("Method: changeTableView(" + table_name + ")")

            // Actualizare view
            this.changeView("table")
            this.viewTable.name = table_name
            this.viewTable.content = {}


            // Declarare body request
            var requestData = { "workspace": this.active_workspace.id }
            console.log("requestData: ", requestData)

            // Preluare date
            await axios.get(this.apiURL + 'table-' + table_name + '/?populate=*&filters[workspace][id][$eq]=' + this.active_workspace.id, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                console.log("response: ", response)

                if (response.data.data.length){
                    for (let index in response.data.data){
                        let item = response.data.data[index]
                        this.viewTable.content[item.id] = {}
                        for (let value in this.viewTable.structure[this.viewTable.name]){
                            if (value == "id") this.viewTable.content[item.id].id = item.id
                            else {
                                let subitem = value.replace( /(^.*\[|\].*$)/g, '' )
                                if (subitem != value){
                                    if (value.replace(/[^[]/g, "").length > 1){
                                        let mainitem = value.substr(0, value.indexOf('['))
                                        if (!this.viewTable.content[item.id][mainitem]) this.viewTable.content[item.id][mainitem] = {}
                                        if (subitem == "id" && item.attributes[mainitem].data) this.viewTable.content[item.id][mainitem][subitem] = item.attributes[mainitem].data.id
                                        else if (subitem == "id") this.viewTable.content[item.id][mainitem][subitem] = "-"
                                        else if (item.attributes[mainitem].data) this.viewTable.content[item.id][mainitem][subitem] = item.attributes[mainitem].data.attributes[subitem]
                                        else this.viewTable.content[item.id][mainitem][subitem] = "-"
                                    } else {
                                        let mainitem = value.substr(0, value.indexOf('['))
                                        if (!this.viewTable.content[item.id][mainitem]) this.viewTable.content[item.id][mainitem] = {}
                                        if (item.attributes[mainitem] != null) this.viewTable.content[item.id][mainitem][subitem] = item.attributes[mainitem][subitem]
                                        else this.viewTable.content[item.id][mainitem][subitem] = "-"
                                    }
                                } else this.viewTable.content[item.id][value] = item.attributes[value]
                            }
                        }
                    }
                }
                // this.viewTable.content = this.viewTable.content.filter(function (el) { return el != null })
                console.log("viewTable: ", this.viewTable)
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
        async seeEntry(entryID, tableName){
            console.log("Method: seeEntry(" + entryID + ", " + tableName + ")")

            if (tableName){
                this.changeTableView(tableName)
                this.seeEntry(entryID)
            } else {
                // Actualizare view
                this.changeView("entry")
                this.viewEntry.id = entryID
                this.viewEntry.content = {}

                // Declarare populateValue
                var populateValue = 'populate[discussions][populate][0]=comment_user'
                if (this.viewTable.name == 'clients') populateValue = "populate[discussions][populate][0]=comment_user&populate[client_contracts]=*"
                if (this.viewTable.name == 'contracts') populateValue = "populate[discussions][populate][0]=comment_user&populate[contract_client]=*" + "&populate[contract_projects]=*"
                else if (this.viewTable.name == 'projects') populateValue = "populate[discussions][populate][0]=comment_user&populate[project_invoices]=*" + "&populate[project_contract]=*" + "&populate[project_tasks][populate][0]=task_employee"
                else if (this.viewTable.name == 'employees') populateValue = "populate[discussions][populate][0]=comment_user&populate[employee_tasks]=*"
                else if (this.viewTable.name == 'invoices') populateValue = "populate[discussions][populate][0]=comment_user&populate[invoice_project]=*" + "&populate[invoice_items][populate][0]=item_product"

                // Preluare date
                await axios.get(this.apiURL + 'table-' + this.viewTable.name + '/' + entryID + '/?' + populateValue, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then(async (response) => {
                    console.log("response: ", response)

                    // Preluare date despre entry
                    this.viewEntry.content = response.data.data.attributes
                    this.viewEntry.content.id = response.data.data.id
                }).catch((error) => {
                    console.log("error: ", error)
                    console.log("error.response: ", error.response)

                    // Daca a expirat token-ul
                    if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                        alert("Your session expired, please login again!")
                        this.logout()
                    } else alert(error.response.data.error.message)
                })
            }
        },
        async addNewEntry(tableName, prefillField, prefillValue){
            console.log("Method: addNewEntry(" + tableName + ", " + prefillField + ", " + prefillValue + ")")

            if (tableName == "close"){
                this.newEntry.visible = false
            } else {
                // Actualizare view
                this.newEntry.visible = true
                this.newEntry.loading = false
                this.newEntry.table = tableName
                this.newEntry.mainRelationOptions = []

                // Preluare optiuni pentru mainRelation
                let relationTable = {
                    contracts:  { table: "clients",     field: "client_name" },
                    projects:   { table: "contracts",   field: "id" },
                    invoices:   { table: "projects",    field: "project_name" },
                    tasks:      { table: "employees",   field: "employee_name" },
                    items:      { table: "products",    field: "product_name" },
                }
                if (this.viewTable.name == 'employees') relationTable.tasks = { table: "projects", field: "project_name" }
                if (relationTable[tableName]) await axios.get(this.apiURL + 'table-' + relationTable[tableName].table, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then(async (response) => {
                    console.log("response: ", response)

                    for (let index in response.data.data){
                        let item = response.data.data[index]
                        let thename = null
                        if (relationTable[tableName].field == "id") thename = item.id
                        else thename = item.attributes[relationTable[tableName].field]
                        this.newEntry.mainRelationOptions.push({
                            id: item.id,
                            name: thename
                        })
                    }

                    // Prepopulare
                    if (prefillField){
                        document.querySelector("#addNewEntry [name='" + prefillField + "']").setAttribute("disabled", true)
                        setTimeout(function(){
                            document.querySelector("#addNewEntry [name='" + prefillField + "']").value = prefillValue
                            document.querySelector("#addNewEntry [name='" + prefillField + "']").removeAttribute("disabled")
                        }, 500)
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
            }
        },
        async submitNewEntry(tableName, middleTable){
            console.log("Method: submitNewEntry(" + tableName + ", " + middleTable + ")")

            // Actualizare view
            this.newEntry.loading = true

            // Generare date
            let requestData = { data: {} }
            for (let index in this.newEntry.structure[tableName]){
                let field = this.newEntry.structure[tableName][index]
                if (!field.ifTable || field.ifTable && field.ifTable == this.viewTable.name){
                    let substrings = field.name.split(".")
                    if (substrings.length == 2) {
                        if (!requestData.data[substrings[0]]) requestData.data[substrings[0]] = {}
                        requestData.data[substrings[0]][substrings[1]] = document.querySelector("[name='" + field.name + "']").value
                    } else requestData.data[field.name] = document.querySelector("[name='" + field.name + "']").value
                }
            }
            requestData.data.workspace = this.active_workspace.id
            requestData.data.discussions = [ { comment_text: "Entry was created.", comment_date: new Date().toISOString(), comment_user: this.user.id } ]
            if (middleTable == 'project-' && this.viewTable.name == 'projects') requestData.data.task_project = this.viewEntry.id
            else if (middleTable == 'project-' && this.viewTable.name == 'employees') requestData.data.task_employee = this.viewEntry.id
            else if (middleTable == 'invoice-') requestData.data.item_invoice = this.viewEntry.id
            console.log("requestData: ", requestData)

            // Trimitere request
            let requestLink = tableName
            if (middleTable) requestLink = middleTable + requestLink
            await axios.post(this.apiURL + 'table-' + requestLink, requestData, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then(async (response) => {
                console.log("response: ", response)

                // Actualizare view
                this.newEntry.loading = false
                this.newEntry.visible = false
                if (middleTable) this.seeEntry(this.viewEntry.id, this.viewTable.name)
                else this.seeEntry(response.data.data.id, tableName)
            }).catch((error) => {
                console.log("error: ", error)
                console.log("error.response: ", error.response)

                // Actualizare view
                this.newEntry.loading = false

                // Daca a expirat token-ul
                if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                    alert("Your session expired, please login again!")
                    this.logout()
                } else alert(error.response.data.error.message)
            })
        },
        async getDataFromCUI(){
            console.log("Method: getDataFromCUI()")

            // Actualizare view
            this.newEntry.loading = true

            // Preluare date despre CUI
            let cui = document.querySelector("input[name='client_cui']").value
            await axios.get('https://infocui.ro/system/api/data?key=d9a54918586aed1776d09700dbf21b6c5806cb3b&cui=' + cui).then(async (response) => {
                console.log("response: ", response)

                // Actualizare date
                if (response.data.status == 200){
                    let data = response.data.data
                    document.querySelector("input[name='client_name']").value = data.nume
                    document.querySelector("input[name='client_trade_register_number']").value = data.cod_inmatriculare
                    document.querySelector("input[name='client_address']").value = data.adresa
                    document.querySelector("select[name='client_vat_payer']").value = data.tva == 'NU' ? false : true
                    document.querySelector("input[name='client_contact_person.person_phone']").value = data.tel
                }

                // Actualizare view
                this.newEntry.loading = false
            }).catch((error) => {
                console.log("error: ", error)
                console.log("error.response: ", error.response)
            })
        },
        async deleteEntry(entryID, tableName){
            console.log("Method: seeEntry(" + entryID + ", " + tableName + ")")

            // Definire request endpoint
            var requestEndpoint = tableName
            if (tableName == "special"){
                console.log(this.viewTable.name, tableName)
                if (this.viewTable.name == "invoices") requestEndpoint = "invoice-items"
                else if (this.viewTable.name == "projects" || this.viewTable.name == "employees") requestEndpoint = "project-tasks"
            }

            // Modal confirmare
            let text = "Are you sure you want to remove this entry? You won't be able to retrive it back!"
            switch (tableName){
                case "clients": text = text + "\n\nAll contracts, projects and invoices related to this client will also be deleted!"; break
                case "contracts": text = text + "\n\nAll projects and invoices related to this contract will also be deleted!"; break
                case "projects": text = text + "\n\nAll invoices related to this project will also be deleted!"; break
                case "products": text = text + "\n\nThe product will also disappear from all invoices containing it!"; break
                case "employees": text = text + "\n\nAll tasks of this employee will also disappear from the projects!"; break
            }
            let confirmAction = confirm(text)
            if (confirmAction){
                await axios.delete(this.apiURL + 'table-' + requestEndpoint + '/' + entryID, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then(async (response) => {
                    console.log("response: ", response)

                    // Actualizare view
                    if (tableName == "special") this.seeEntry(this.viewEntry.id)
                    else this.changeTableView(tableName)
                }).catch((error) => {
                    console.log("error: ", error)
                    console.log("error.response: ", error.response)

                    // Daca a expirat token-ul
                    if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                        alert("Your session expired, please login again!")
                        this.logout()
                    } else alert(error.response.data.error.message)
                })
            }
        },
        async submitComment(){
            console.log("Method: submitComment()")

            // Declarare requestData
            var requestData = {
                entry_id: this.viewEntry.id,
                entry_table: this.viewTable.name,
                comment_object: {
                    comment_text: document.querySelector("[name='commentText']").value,
                    comment_date: new Date().toISOString(),
                    comment_user: this.user.id
                }
            }

            // Submit comentariu
            await axios.post(this.apiURL + 'workspaces/addComment/', requestData, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then(async (response) => {
                console.log("response: ", response)
                this.seeEntry(this.viewEntry.id)
                document.querySelector("[name='commentText']").value = ''
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
        async switchToggle(entryID, fieldName, currentValue){
            console.log("Method: switchToggle(" + entryID + ", " + fieldName + ", " + currentValue + ")")

            // Declarare requestData
            let requestEndpoint = {
                "task_done": "table-project-tasks/",
                "invoice_paid": "table-invoices/"
            }
            let requestData = { data: {} }
            requestData.data[fieldName] = !currentValue

            // Actualizare switch
            await axios.put(this.apiURL + requestEndpoint[fieldName] + entryID, requestData, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                console.log("response: ", response)

                // Actualizare view
                this.seeEntry(this.viewEntry.id)
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
        toggleEditEntry(action){
            console.log("Method: togglEditEntry(" + action + ")")

            if (action == "close") this.editEntry.visible = false
            else this.editEntry.visible = true



        },
        toggleEditField(fieldName){
            console.log("Method: toggleEditField(" + fieldName + ")")
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

                :deep(p){
                    text-transform: capitalize;
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

        .screenhead{
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;

            .breadcrumbs{
                display: flex;
                align-items: center;
                gap: 4px;
                flex-grow: 1;

                img{ width: 16px; height: 16px; }

                > :last-child{ color: var(--main) }

                h5{ text-transform: capitalize; }
            }
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

        .view-entry{
            display: grid;
            grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
            gap: 24px;

            .left{
                display: flex;
                flex-direction: column;
                gap: 24px;

                .sectionBox{
                    &.boxtype3{
                        .table{
                            .tableHead:not(.noPadding){
                                padding-left: 72px;
                            }
                            .tableRows{
                                .tableRow{
                                    .toggle{
                                        cursor: pointer;
                                        transition: all 0.3s ease;

                                        &:hover{
                                            color: var(--main);
                                            font-weight: 600;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    .sectionBoxHead{
                        display: flex;
                        align-items: center;
                        gap: 24px;
                        h5{ flex-grow: 1; }
                    }

                    .entryFields{
                        display: grid;
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                        gap: 24px;

                        .asField{
                            :deep(label){
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                            }
                        }
                    }
                }
            }

            .right{
                display: flex;
                position: sticky;
                top: 24px;
                height: calc(100vh - 117px);
                .sectionBox{
                    

                    .commentsList{
                        flex-grow: 1;
                        height: 1px;
                        overflow: scroll;
                        display: flex;
                        flex-direction: column-reverse;
                        gap: 24px;

                        .commentBox{
                            display: flex;
                            flex-direction: column;
                            gap: 4px;

                            &.personal{
                                padding: 16px;
                                background: var(--97-gray);
                                .commentTop{
                                    flex-direction: row-reverse;

                                    p:first-child{ color: var(--accent); }
                                }
                            }

                            .commentTop{
                                display: flex;
                                align-items: center;
                                justify-content: space-between;

                                p:first-child{
                                    font-weight: 600;
                                    color: var(--main);
                                }
                                p:last-child{ color: var(--75-gray); }
                            }
                        }
                    }

                    .leaveComment{
                        display: flex;
                        flex-direction: column;

                        :deep(input){ border-radius: 3px 3px 0 0; }

                        button{
                            border-radius: 0 0 3px 3px;

                            :deep(p){
                                flex-grow: 1;
                                text-align: left;
                            }
                        }
                    }
                }
            }
        }

        .view-table{
            .table{
                margin: 0;
                border-radius: 3px;

                .tableHead{
                    border-radius: 3px 3px 0 0;
                    .tableHeadItem{
                        flex-grow: 1;
                        &:first-child{ margin-left: 48px; }
                    }
                }

                .tableRows{
                    background: var(--pure-white);
                    border-radius: 0 0 3px 3px;

                    .tableRow{
                        p{
                            flex-grow: 1;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        }
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
                        grid-template-columns: repeat(1, minmax(0, 1fr));
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
#addNewEntry{
    .modal-container{
        h3{
            span.tableTitle{
                font-weight: 700;
                text-transform: capitalize;
            }
        }
        form{
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 24px;

            &.loading{
                pointer-events: none;
                filter: grayscale(1);
                opacity: 0.5;
            }

            .as-separator{
                grid-column-start: 1;
                grid-column-end: 4;
            }

            .asField{
                display: flex;
                flex-direction: column;

                label{
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 4px;
                    color: var(--25-gray);
                }

                select{
                    font-family: 'Poppins', sans-serif;
                    font-size: 14px;
                    border-radius: 3px;
                    padding: 12px 24px;
                    text-transform: capitalize;
                }
            }
        }
    }
}
</style>