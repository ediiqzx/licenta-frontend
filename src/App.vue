<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
  <!-- <RouterLink to="/">Home</RouterLink>
  <RouterLink to="/about">About</RouterLink> -->
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap');

:root {
  --main: #5668F6;
  --main-glass: #EEF0FE;
  --main-dark: #3749DB;
  --main-light: #7383FF;

  --accent: #CC56F6;
  --accent-glass: #FAEEFE;
  --accent-dark: #B037DB;
  --accent-light: #DA73FF;

  --pure-white: #ffffff;
  --pure-black: #000000;

  --97-gray: #f7f7f7;
  --75-gray: #bfbfbf;
  --50-gray: #808080;
  --25-gray: #404040;

  --25-gray-75opc: #404040BF;

  --brand-gradient: linear-gradient(45deg, #5668F6 0%, #CC56F6 100%);
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  position: relative;
  font-weight: normal;
}

body {
  min-height: 100vh;
  background: var(--main-glass);
  color: var(--25-gray);

  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  line-height: 150%;

  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6, p, a, button, input{
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
}

h3{  font-size: 24px; font-weight: 700; }
h4{  font-size: 20px; font-weight: 700; }
h5{  font-size: 16px; font-weight: 600; }

.as-separator{
  width: 100%;
  height: 1px;
  background-color: var(--main);
  opacity: 0.1;
}

.sectionBox{
  width: 100%;
  background: var(--pure-white);
  padding: 24px;
  border-radius: 3px;
  border: 1px solid var(--75-gray);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.table{
  display: flex;
  flex-direction: column;
  margin-left: -24px;
  margin-right: -24px;
  margin-bottom: -24px;

  .tableHead{
    background: var(--main);
    color: var(--pure-white);
    padding: 12px 24px;
    display: flex;
    align-items: center;
    gap: 24px;

    .tableHeadItem{
      width: 128px;
      &.grow{ flex-grow: 1; }
    }

    > img{ width: 16px; }

    p{
      font-weight: 600;
    }
  }

  .tableRows{
    .table-no-content{
      background: #fff;
      padding: 24px;
      border-radius: 0 0 3px 3px;
      font-weight: 600;
    }

    .tableRow{
      display: flex;
      align-items: center;
      padding: 12px 24px;
      gap: 24px;

      > * {
        width: 128px;
        &.grow{
          width: 1px;
          flex-grow: 1;
        }
      }

      &:not(:last-child){
        border-bottom: 1px solid var(--main-glass);
      }

      .rowButtons{
        display: flex;
        gap: 12px;
        width: auto;

        img{
            width: 24px;
            height: 24px;
            filter: grayscale(1);
            transition: all 0.3s ease;
            cursor: pointer;

            &.twoxbutton{
              width: 60px;
            }

            &:hover{ filter: none; }
        }
      }
    }
  }
}

.popper{
  background: var(--pure-white) !important;
  padding: 12px 24px !important;
  border-radius: 3px !important;
  color: var(--25-gray) !important;
  font-weight: 600 !important;
  box-shadow: 0 10px 10px rgb(0 0 0 / 25%) !important;
  
  > p {
    font-size: 12px !important;
    margin-bottom: 4px;
  }
}

.modal-overlay{
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: var(--25-gray-75opc);
    display: flex;
    align-items: center;
    justify-content: center;

    .modal-container{
        background: var(--main-glass);
        padding: 64px;
        border-radius: 3px;
        width: calc(100vw - 256px);
        display: flex;
        flex-direction: column;
        gap: 24px;

        h3{ color: var(--main); }

        .modal-head{
          display: flex;
          align-items: center;
          justify-content: space-between;

          img{
            width: 20px;
            opacity: 0.5;
            transition: all 0.3s ease;
            &:hover{ opacity: 1 !important; cursor: pointer; }
          }
        }

        form{
          .formEnd{
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
            width: 100%;
            grid-column-start: 1;
            grid-column-end: 4;

            > *{ flex-grow: 1; }

            button{
              :deep(p){
                flex-grow: 1;
                text-align: left;
              }
            }
          }
        }
    }
}

</style>
