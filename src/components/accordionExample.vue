<template>
    <accordion v-model="open">
        <accordionItem id="1" title="What is Vue?">
            A JavaScript framework.
        </accordionItem>

        <accordionItem id="2" title="pricing">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">plan</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">price</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">acess</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>pro</td>
                        <td>29</td>
                        <td>Yes</td>
                    </tr>
                    <tr>
                        <td>free</td>
                        <td>0</td>
                        <td>yes</td>
                    </tr>
                    <tr>
                        <td>enterprise</td>
                        <td>$99</td>
                        <td>yes</td>
                    </tr>
                </tbody>


            </table>
        </accordionItem>

    </accordion>
    <!-- multiple accodion -->
    <h2>Multiple open Accordion example</h2>
    <accordion v-model="openMultiple" :multiple="true">
        <accordionItem id="a" title="A">
            Content A
        </accordionItem>
        <accordionItem id="b" title="B">
            Content B
        </accordionItem>
    </accordion>


</template>

<script setup lang="ts">
import accordion from './accordion.vue';
import accordionItem from './accordionItem.vue';
import { ref } from "vue"

const open = ref<string[]>(['1'])
const openMultiple = ref<string[]>(['a'])




</script>

<style scoped></style>