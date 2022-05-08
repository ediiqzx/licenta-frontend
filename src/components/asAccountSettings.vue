<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <h3>Account Settings</h3>
            <div class="as-separator"></div>
            <form v-on:submit.prevent="saveAccountSettings()">
                <asField label="Change display name" icon="user-main-16.png" type="text" placeholder="" name="display_name" v-model="formData.display_name" required/>
                <!-- <asField label="Change password" icon="lock-main-16.png" type="password" placeholder="" name="new_password" v-model="formData.new_password"/> -->
                <div class="as-separator"></div>
                <div class="formEnd">
                    <template v-if="formStatus == 'normal'">
                        <asButton bttnType="secondary" label="Cancel" icon="block-white-16.png" type="button" @click="$emit('closeAccountSettings')"/>
                        <asButton bttnType="main" label="Save" icon="save-white-16.png" :disabled="!differentName"/>
                    </template>
                    <asButton v-else bttnType="loading" label="Please wait..." icon="loading.gif" disabled/>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import asField from '@/components/asField.vue'
import asButton from '@/components/asButton.vue'

export default {
    name: 'Account Settings',
    components: { asField, asButton },
    data(){
        return {
            formData: {
                display_name: '',
                // new_password: '',
            },
            user: {
                jwt: null,
                id: null,
                email: null,
                display_name: null,
            },
            formStatus: 'normal',
        }
    },
    computed: {
        differentName(){
            if (this.formData.display_name != this.user.display_name && this.formData.display_name != null && this.formData.display_name != '') return true
            else return false
        }
    },
    async mounted(){
        // Preluare date user
        var userData = this.$cookies.get('allspace_user')
        this.user.jwt = userData.jwt
        this.user.id = userData.id
        this.user.email = userData.email
        this.user.display_name = userData.display_name

        // Trecere date user in formData
        this.formData.display_name = this.user.display_name
    },
    methods: {
        logout(){
            this.$cookies.remove('allspace_user')
            this.$router.push({ name:'login' })
        },
        async saveAccountSettings(){
            // Preluare date
            var newDisplayName = false
            var updateData = {}
            if(this.formData.display_name != this.user.display_name && this.formData.display_name != null && this.formData.display_name != '') updateData.display_name = this.formData.display_name
            // var newPassword = false
            // if(this.formData.new_password && this.formData.new_password != null && this.formData.new_password != '') newPassword = this.formData.new_password
            // console.log("newPassword: ", newPassword)

            // Trimitere actualizare
            console.log("UpdateData: ", updateData)
            await axios.put(this.apiURL + 'users/' + this.user.id, updateData, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {
                console.log("Response: ", response)
                console.log("Response Data: ", response.data)

                // Actualizare data
                this.user.display_name = response.data.display_name
                this.formData.display_name = response.data.display_name
                var userCookie = this.$cookies.get('allspace_user')
                userCookie.display_name = response.data.display_name
                this.$cookies.set('allspace_user', userCookie)
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
    }
}
</script>

<style lang="scss" scoped>
.modal-overlay{
    .modal-container{
        width: 608px;

        form{
            display: flex;
            flex-direction: column;
            gap: 24px;
        }
    }
}
</style>