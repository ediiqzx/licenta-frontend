<template>
	<main>
		<img src="../assets/logo.png" class="as-logo"/>
		<form name="loginForm" v-on:submit.prevent="login()">
			<asField name="email" type="email" label="Email Address" required icon="email-blue-16.png" v-model="loginForm.email" :disabled="loginForm.loading"/>
			<asField name="password" type="password" label="Password" required placeholder="**********" icon="password-blue-16.png" v-model="loginForm.password" :disabled="loginForm.loading"/>
			<asButton v-if="loginForm.loading" bttnType="loading" label="Please wait..." icon="loading.gif" disabled/>
			<asButton v-else bttnType="main" label="Connect" icon="arrowRight-white-16.png"/>
		</form>
		<button class="register" @click="toggleRegisterPopup(true)">
			<p>New to allSpace? Register now!</p>
			<img src="../assets/arrowRightBoxed-white-16.png"/>
		</button>
	</main>
	<div v-if="registerPopup" class="popupContainer" id="register">
		<div class="popupContent">
			<div class="top">
				<h3>Register in allSpace</h3>
				<img src="../assets/close-blue-20.png" @click="toggleRegisterPopup(false)">
			</div>
			<div class="as-separator"></div>
			<form name="registerForm" v-on:submit.prevent="register()" method="POST">
				<asField name="email" 			type="email" 	label="Email Address"					required 									icon="email-blue-16.png"	v-model="registerForm.email"		:disabled="registerForm.loading"/>
				<asField name="password"		type="password"	label="Password (min. 6 characters)"	required placeholder="***************"		icon="password-blue-16.png"	v-model="registerForm.password"		:disabled="registerForm.loading" :minlength="6"/>
				<div class="as-separator"></div>
				<asField name="display_name"	type="text"	label="Display name"	placeholder="Alexandru Popescu"	icon="user-blue-16.png"			v-model="registerForm.display_name"		:disabled="registerForm.loading"/>
				<div class="as-separator"></div>
				<asButton v-if="registerForm.loading" bttnType="loading" label="Please wait..." icon="loading.gif" disabled/>
				<asButton v-else bttnType="main" label="Register" icon="arrowRight-white-16.png"/>
			</form>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import asField from '@/components/asField.vue'
import asButton from '@/components/asButton.vue'
export default {
	name: 'login',
	components: { asField, asButton },
	data(){
		return{
			registerPopup: false,
			loginForm: {
				email: '',
				password: '',
				loading: false,
				
			},
			registerForm: {
				email: '',
				password: '',
				display_name: '',
				loading: false,
			},
		}
	},
	computed: {

	},
	async mounted(){
		var userData = this.$cookies.get('allspace_user')
		if (userData) this.$router.push({ name:'dashboard' })
	},
	methods: {
		toggleRegisterPopup(state){
			if (state) this.registerPopup = state
			else this.registerPopup = !this.registerPopup
		},
		async register(){
			console.log("Register Form: ", this.registerForm)
			this.registerForm.loading = true

			var display_name
			if (this.registerForm.display_name) display_name = this.registerForm.display_name
			else display_name = this.registerForm.email
			
			await axios.post(this.apiURL + 'auth/local/register', {
				email: this.registerForm.email,
				username: this.registerForm.email,
				password: this.registerForm.password,
				display_name: display_name,
			}).then(async (response) => {
				console.log("Response: ", response)

				// Deblocare formular
				this.registerForm.loading = false

				// Setare cookie user
				this.$cookies.set('allspace_user', {
					jwt: response.data.jwt,
					id: response.data.user.id,
					email: response.data.user.email,
					display_name: response.data.user.display_name
				})

				// Redirectionare la dashboard
				this.$router.push({ name:'dashboard' })
			}).catch((error) => {
          		console.log("Error: ", error)
          		console.log("Error Response: ", error.response)
				alert(error.response.data.error.message)
				this.registerForm.loading = false
        	})
		},
		async login(){
			console.log("Login Form: ", this.loginForm)
			this.loginForm.loading = true

			await axios.post(this.apiURL + 'auth/local', {
				identifier: this.loginForm.email,
				password: this.loginForm.password,
			}).then((response) => {
				console.log("Response: ", response)

				// Deblocare formular
				this.loginForm.loading = false

				// Setare cookie user
				this.$cookies.set('allspace_user', {
					jwt: response.data.jwt,
					id: response.data.user.id,
					email: response.data.user.email,
					display_name: response.data.user.display_name
				})

				// Redirectionare la dashboard 
				this.$router.push({ name:'dashboard' })
			}).catch((error) => {
          		console.log("Error: ", error)
          		console.log("Error Response: ", error.response)
				alert(error.response.data.error.message)
				this.loginForm.loading = false
        	})
		}
	}
}
</script>

<style lang="scss" scoped>
	main{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;

		min-height: 100vh;
		padding: 128px 128px 0;

		img.as-logo{
			max-height: 64px;
			margin-bottom: 128px;
		}
		form{
			display: flex;
			flex-direction: column;
			gap: 24px;
			width: 100%;
			max-width: 480px;
			button:deep(p) {
				flex-grow: 1;
				text-align: left;
			}
		}
		button.register{
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 32px 128px 0;
			gap: 8px;
			border-radius: 24px 24px 0 0;
			background: var(--brand-gradient);
			cursor: pointer;
			transition: all 0.3s ease;
			border: 0;

			&:hover{
				box-shadow: 0 0 64px var(--accent);
				padding: 32px 256px;
				margin-top: -32px;
			}

			p{
				font-weight: 600;
				color: #fff;
			}
			img{ width: 16px; height: 16px; }
		}
	}
	.popupContainer{
		position: fixed;
		width: 100%;
		height: 100%;
		background: #000000BF;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		z-index: 999;

		.popupContent{
			width: 100%;
			max-width: 608px;
			background: var(--main-glass);
			border-radius: 3px;
			padding: 64px;
			display: flex;
			flex-direction: column;
			gap: 24px;

			.top{
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				h3{ color: var(--main); }
				img{
					width: 20px; height: 20px;
					opacity: 0.5;
					transition: all 0.1s ease;
					cursor: pointer;
					&:hover{ opacity: 1; }
				}
			}

			form{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: 24px;

				& > * { width: 100%; }

				button:deep(p){ flex-grow: 1; text-align: left; }
			}
		}
	}
</style>