<template>
    <div>
        Foo
        <button @click="clickMe">clickMe</button>
        {{this.$store.state.name}}
    </div>
</template>

<script>
// vue 优化 pwa + ssr 做离线缓存和服务端渲染
export default {
    name: 'Foo',
    // 客户端调用
    mounted(){
        console.log('mounted');
        this.$store.dispatch('changeName');
    },
    // asyncData这个方法(来源于Nuxt.js定义的规范)只在服务端被调用，并且只在页面中执行
    asyncData(store){
        console.log('server');
        return store.dispatch('changeName');
    },
    methods: {
        clickMe(){
            alert('clickMe');
        }
    }
}
</script>
