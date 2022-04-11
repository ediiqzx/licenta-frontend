<template>
    <button :class="'button as-button-' + bttnType" :type="form ? 'submit' : ''">
        <img v-if="icon && iconPosition == 'left'" :src="icon"/>
        <p class="as-button-label">{{ label }}</p>
        <img v-if="icon && iconPosition == 'right'" :src="icon"/>
    </button>
</template>

<script>
export default {
    name: 'asButton',
    props: {
        bttnType: { type: String, default: 'secondary' },
        label: { type: String, default: 'Button Label' },
        icon: { type: String, default: '' },
        iconPosition: { type: String, default: 'right' },
        form: { type: String, default: '' }
    }
}
</script>

<style lang="scss" scoped>
    button{
        border-radius: 3px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: 0;
        padding: 0;
        background: transparent;
        
        &:not(:disabled){ cursor: pointer; }

        img{ width: 16px; height: 16px; }
        p{ transition: all 0.3s ease; }

        &.as-button-main, &.as-button-loading, &.as-button-secondary{
            padding: 12px 24px;
        }

        &.as-button-main{
            background: var(--main);
            p{
                color: var(--pure-white);
                font-weight: 600;
            }
            &:hover{ background: var(--accent); }
            &:disabled{ background: var(--75-gray); }
        }

        &.as-button-secondary{
            background: var(--25-gray);
            p{
                color: var(--pure-white);
                font-weight: 600;
            }
            &:hover{ background: var(--main); }
            &:disabled{ background: var(--75-gray); }
        }

        &.as-button-third{
            p{
                color: var(--25-gray);
                font-weight: 600;
            }
            &:hover{ 
                p{ color: var(--main); }
            }
        }

        &.as-button-loading{
            background: var(--25-gray);
            p{
                color: var(--pure-white);
                font-weight: 600;
            }
            img{ mix-blend-mode: lighten; }
        }
    }
</style>>