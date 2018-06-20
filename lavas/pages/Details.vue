<template>
    <div>
        <h1>{{text}}</h1>

        <li>
            <router-link to="/">首页</router-link>
            <router-link to="/details">详情</router-link>
        </li>
    </div>
</template>
<script>
    export default{
        name: 'details',
        data() {
            return {
                text: '这是详情页'
            }
        }
    }
</script>
<style></style>