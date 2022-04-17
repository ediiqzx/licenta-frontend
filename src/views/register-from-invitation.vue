<template>
    <div class="as-container">
        <img src="../assets/logo.png"/>
        <h4 class="screenTitle">Hoooray 🎉 {{ invitation.invited_by }} invited you into “{{ invitation.workspace.name }}" workspace!</h4>
        <form v-on:submit.prevent="register()" method="POST" v-if="userExist == false">
            <asField background="#F7F7F7" name="email" type="email" label="Email Address" required icon="../email-main-16.png" v-model="register_form.email" disabled/>
            <asField background="#F7F7F7" name="password" type="password" label="Password (min. 6 characters)" required placeholder="***************" icon="../lock-main-16.png" v-model="register_form.password" :disabled="loading" :minlength="6"/>
            <div class="as-separator"></div>
            <asField background="#F7F7F7" name="display_name" type="text" label="Display name" placeholder="Alexandru Popescu" icon="../user-main-16.png" v-model="register_form.display_name" :disabled="loading"/>
            <div class="as-separator"></div>
            <asButton v-if="loading" bttnType="loading" label="Please wait..." icon="../loading.gif" disabled/>
            <asButton v-else bttnType="main" label="Register" icon="../arrowRight-white-16.png"/>
        </form>
        <form v-on:submit.prevent="login()" method="POST" v-else-if="userExist == true">
            <p class="loginText">We recognized you as an existing user of allSpace.</p>
            <p class="loginText">To accept or decline the invitation please login first!</p>
            <div class="as-separator"></div>
            <asField background="#F7F7F7" name="email" type="email" label="Email Address" required icon="../email-main-16.png" v-model="login_form.email" disabled/>
			<asField background="#F7F7F7" name="password" type="password" label="Password" required placeholder="**********" icon="../lock-main-16.png" v-model="login_form.password" :disabled="loading"/>
			<asButton v-if="loading" bttnType="loading" label="Please wait..." icon="../loading.gif" disabled/>
			<asButton v-else bttnType="main" label="Connect" icon="../arrowRight-white-16.png"/>
        </form>
        <div v-else class="acceptOrDeclineBox">
            <h4>Do you want to accept this invitation?</h4>
            <div class="as-separator"></div>
            <p><span style="font-weight: 600; color: var(--main)">Workspace:</span> {{ invitation.workspace.name }}</p>
            <p><span style="font-weight: 600; color: var(--main)">Your Role:</span> {{ invitation.role }}</p>
            <p><span style="font-weight: 600; color: var(--main)">Invited By:</span> {{ invitation.invited_by }}</p>
            <asButton v-if="loading" bttnType="loading" label="Please wait..." icon="../loading.gif" disabled/>
            <div class="twoButtons" v-else>
                <asButton bttnType="secondary" label="Decline" icon="../block-white-16.png" @click="handleInvitation(false)"/>
                <asButton bttnType="main" label="Accept" icon="../check-white-16.png" @click="handleInvitation(true)"/>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import asField from '@/components/asField.vue'
import asButton from '@/components/asButton.vue'
export default {
	name: 'register-from-invitation',
	components: { asField, asButton },
	data(){
        return {
            loading: false,
            userExist: false,
            register_form: {
                email: null,
                password: null,
                display_name: null,
            },
            login_form: {
                email: null,
                password: null,
            },
            invitation: {
                id: null,
                email: null,
                workspace: {
                    id: null,
                    name: null,
                },
                role: null,
                invited_by: null,
            },
            user: {
                jwt: null,
                id: null,
                email: null,
                display_name: null,
            }
        }
    },
    computed: {
    },
    async mounted(){
        console.log('\n', '\n', "===== MOUNTING... =====")

        // Eliminare user cookie daca exista deja
        this.$cookies.remove('allspace_user')

        // Preluare ID invitatie in data
        this.invitation.id = this.$route.query.invitation

        // Preluare date despre invitatie
        await axios.get(this.apiURL + 'pending-invitations/' + this.invitation.id + '?populate[0]=workspace&populate[1]=invited_by').then((response) => {
            console.log("Response: ", response)

            // Actualizare data
            this.invitation.email = response.data.data.attributes.email
            this.invitation.workspace.id = response.data.data.attributes.workspace.data.id
            this.invitation.workspace.name = response.data.data.attributes.workspace.data.attributes.name
            this.invitation.role = response.data.data.attributes.role
            this.invitation.invited_by = response.data.data.attributes.invited_by.data.attributes.display_name

            // Setare email inregistrare/conectare
            this.register_form.email = this.invitation.email
            this.login_form.email = this.invitation.email
        }).catch((error) => {
            console.log("Error: ", error)
            console.log("Error Response: ", error.response)
            alert(error.response.data.error.message)
            alert("We will redirect you to the login page.")
            this.logout()
        })

        // Verificare daca exista deja contul
        var emailToCheck = encodeURIComponent(this.invitation.email)
        await axios.get(this.apiURL + 'users?filters[email][$eq]=' + emailToCheck).then((response) => {
            console.log("Response: ", response)

            // Actualizare data
            if (response.data.length) this.userExist = true
        }).catch((error) => {
            console.log("Error: ", error)
            console.log("Error Response: ", error.response)
            alert(error.response.data.error.message)
            alert("We will redirect you to the login page.")
            this.logout()
        })
    },
    methods: {
        logout(){
            this.$cookies.remove('allspace_user')
            this.$router.push({ name:'login' })
        },
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
        async register(){
			console.log("Register Form:", this.register_form)
			this.loading = true

			var display_name
			if (this.register_form.display_name) display_name = this.register_form.display_name
			else display_name = this.register_form.email
			
			await axios.post(this.apiURL + 'auth/local/register', {
				email: this.register_form.email,
				username: this.register_form.email,
				password: this.register_form.password,
				display_name: display_name,
			}).then(async (response) => {
				console.log("Response:", response)

                // Setare cookie user
				this.$cookies.set('allspace_user', {
					jwt: response.data.jwt,
					id: response.data.user.id,
					email: response.data.user.email,
					display_name: response.data.user.display_name
				})

                // Preluare date user
                this.fetchUser()

                // Declarare body request
                var requestData = {
                    invitationID: this.invitation.id,
                    userID: this.user.id
                }

                // Prelucrare invitatie
                await axios.post(this.apiURL + 'pending-invitations/handleInvitation/', requestData, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {

                }).then(async (response) => {
				    console.log("Response:", response)

                }).catch((error) => {
                    console.log("Error: ", error)
                    console.log("Error Response: ", error.response)

                    // Daca a expirat token-ul
                    if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                        alert("Your session expired, please login again!")
                        this.logout()
                    } else alert(error.response.data.error.message)
                })

				// Redirectionare la dashboard
				this.$router.push({ name: 'dashboard', params: { fromInvitation: true } })
			}).catch((error) => {
          		console.log("Error:", error)
          		console.log("Error Response:", error.response)
				alert(error.response.data.error.message)
				this.registerForm.loading = false
        	})
		},
        async login(){
			console.log("Login Form:", this.login_form)
			this.loading = true

			await axios.post(this.apiURL + 'auth/local', {
				identifier: this.login_form.email,
				password: this.login_form.password,
			}).then((response) => {
				console.log("Response:", response)

				// Setare cookie user
				this.$cookies.set('allspace_user', {
					jwt: response.data.jwt,
					id: response.data.user.id,
					email: response.data.user.email,
					display_name: response.data.user.display_name
				})

                // Preluare date user
                this.fetchUser()

                // Actualizare data
                this.userExist = "connected"
                this.loading = false
			}).catch((error) => {
          		console.log("Error:", error)
          		console.log("Error Response:", error.response)
				alert(error.response.data.error.message)
				this.loading = false
        	})
		},
        async handleInvitation(answer){
            if (answer){
                // Declarare body request
                var requestData = {
                    invitationID: this.invitation.id,
                    userID: this.user.id
                }

                // Prelucrare invitatie
                await axios.post(this.apiURL + 'pending-invitations/handleInvitation/', requestData, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {

                }).then(async (response) => {
				    console.log("Response:", response)
                    alert("Invitation was accepted.")
                }).catch((error) => {
                    console.log("Error: ", error)
                    console.log("Error Response: ", error.response)

                    // Daca a expirat token-ul
                    if (error.response.data.error.status == 401 && error.response.data.error.name == "UnauthorizedError"){
                        alert("Your session expired, please login again!")
                        this.logout()
                    } else alert(error.response.data.error.message)
                })
            } else {
                // Declarare body request
                var requestData = {
                    invitationID: this.invitation.id,
                    userID: this.user.id,
                    refusal: true
                }

                // Prelucrare invitatie
                await axios.post(this.apiURL + 'pending-invitations/handleInvitation/', requestData, { headers: { Authorization: 'Bearer ' + this.user.jwt } } ).then((response) => {

                }).then(async (response) => {
				    console.log("Response:", response)
                    alert("Invitation was declined.")
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
        
            // Redirectionare la dashboard
            this.$router.push({ name: 'dashboard', params: { fromInvitation: true } })
        },
    }
}
</script>

<style lang="scss" scoped>
.as-container{
    padding-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;

    > img{
        max-width: 192px;
        height: auto;
        margin-bottom: 32px;
    }

    > h4{
        width: 100%;
        padding: 12px 24px;
        background: var(--accent);
        color: var(--pure-white);
        text-align: center;
    }

    > form, > .acceptOrDeclineBox{
        padding: 36px 48px 48px;
        background: var(--pure-white);
        display: flex;
        flex-direction: column;
        width: calc(480px + 96px);
        gap: 24px;

        p.loginText{
            font-weight: 600;
            text-align: center;

            &:first-child{
                margin-bottom: -12px;
            }
        }

        button{
            :deep(p){
                flex-grow: 1;
                text-align: left;
            }
        }

        .twoButtons{
            display: flex;
            gap: 24px;

            button{ flex-grow: 1; }
        }
    }
}
</style>