<template>
    <div class="asField">
        <label v-if="!hideLabel">
            <img v-if="editable" src="../assets/edit-25gray-16.png" @click="$emit('clicked')"/>
            {{ label }}<span style="color: var(--accent)">{{ requiredMark }}</span>
        </label>
        <input v-if="type == 'email'"           type="email"		:placeholder="placeholder" :minlength="minlength" :name="name" :value="modelValue" :required="required" :disabled="disabled" :class="{'with-icon': icon}" @input="$emit('update:modelValue', $event.target.value)" :style="style"/>
        <input v-else-if="type == 'password'"   type="password"		:placeholder="placeholder" :minlength="minlength" :name="name" :value="modelValue" :required="required" :disabled="disabled" :class="{'with-icon': icon}" @input="$emit('update:modelValue', $event.target.value)" :style="style"/>
        <input v-else-if="type == 'text'"       type="text"			:placeholder="placeholder" :minlength="minlength" :name="name" :value="modelValue" :required="required" :disabled="disabled" :class="{'with-icon': icon}" @input="$emit('update:modelValue', $event.target.value)" :style="style"/>
        <input v-else-if="type == 'file'"       type="file"			:placeholder="placeholder" :minlength="minlength" :name="name" :value="modelValue" :required="required" :disabled="disabled" :class="{'with-icon': icon}" @input="$emit('update:modelValue', $event.target.value)" :style="style"/>
        <input v-else-if="type == 'number'"     type="number"		:placeholder="placeholder" :minlength="minlength" :name="name" :value="modelValue" :required="required" :disabled="disabled" :class="{'with-icon': icon}" @input="$emit('update:modelValue', $event.target.value)" :style="style" :min="min" :step="step"/>
        <input v-else-if="type == 'date'"       type="date"		    :placeholder="placeholder" :minlength="minlength" :name="name" :value="modelValue" :required="required" :disabled="disabled" :class="{'with-icon': icon}" @input="$emit('update:modelValue', $event.target.value)" :style="style"/>
    </div>
</template>

<script>
export default {
    name: 'asField',
    props: {
        label: {
            type: String,
            default: 'Field label here'
        },
        icon: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'email'
        },
        placeholder: {
            type: String,
            default: 'your_email_address@gmail.com'
        },
        name: {
            type: String,
            required: true
        },
        modelValue: {
        },
        required: {
            type: Boolean
        },
        disabled: {
            type: Boolean
        },
        hideLabel: {
            type: Boolean,
            default: false,
        },
        editable: {
            type: Boolean,
            default: false,
        },
        background: {
            type: String,
            default: '#ffffff'
        },
        minlength: {
            type: Number,
            default: 0
        },
        min: {
            type: Number,
            default: 0
        },
        step: {
            type: Number,
            default: 1
        },
    },
    emits: ['update:modelValue', 'clicked'],
    data(){
        return{

        }
    },
    computed: {
        style(){
            var iconReturn = ""
            if (this.icon) iconReturn = `url(${this.icon})`
            return {
                'background-color': this.background,
                'background-image': iconReturn,
            }
        },
        requiredMark(){
            if (this.required) return " *"
            else return " (optional)"
        }
    }
}
</script>

<style lang="scss" scoped>
    .asField{
        display: flex;
        flex-direction: column;

        label{
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
            color: var(--25-gray);
            display: flex;
            align-items: center;

            img{
                width: 16px;
                height: 16px;
                margin-right: 8px; 
                opacity: 0.5;
                transition: all 0.3s ease;
                cursor: pointer;
                &:hover{ opacity: 1; }
            }
        }

        input{
            padding: 12px 24px;
            border-radius: 3px;
            border: 1px solid var(--75-gray);
            font-family: 'Poppins', sans-serif;
            font-weight: 500;
            font-size: 14px;
            line-height: 150%;
            color: var(--25-gray);
            transition: all 0.3s ease;
            outline: none;

            &.with-icon{
                background-size: 16px 16px;
                background-repeat: no-repeat;
                background-position: 24px 50%;
                padding: 12px 24px 12px 64px;
            }

            &::placeholder{ color: var(--75-gray); }
            &:hover{ border-color: var(--accent); }
            &:not(:placeholder-shown){ border-color: red; }
            &:valid{ border-color: var(--main); }
            &:disabled{
                border: 0;
                filter: grayscale(100%);
                color: var(--25-gray-75opc);
            }
        }
    }
</style>