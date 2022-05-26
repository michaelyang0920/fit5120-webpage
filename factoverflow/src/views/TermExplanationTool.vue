<template>
    <div id="term-explain">
        <div class="term-explanation-main">
            <div class="term-tool-instruction">
             <h3>What is Term Explanation Tool?</h3>
                <div class="instruction-text"> Do you feel confused when reading some news with some terminologies and abbreviations? Term Explanation Tool is here to save the day when you are reading information and help to understand the word more comprehensively. You enter the news contents, and all the unique terms with their definitions would display right away.
                </div>
            <div class="input-box">
                <el-input
                    type="textarea"
                    rows="20"
                    placeholder="Please Enter the news Content"
                    v-model="textarea1">
            </el-input> <div class="term-button"><el-button type="danger" @click="clearInput" v-loading.fullscreen.lock="fullscreenLoading">Clear</el-button><el-button type="primary" @click="getDefinition()">Submit</el-button></div></div>
        </div>
            <div class="term-explanation-result">
                <h3>Highlight Result</h3>
                <div class="term-highlight" v-if="seen"><div class="news-content"><div class="highlight-result" v-html="this.highLight"></div></div></div>
            </div>
        </div>
        <div class="term-definition" :style="[seen?{'height':'auto'}:{'height':'0px'}]">
            <el-table :data="defList.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%" v-if="seen">
                <el-table-column prop="title" label="Entity Name" min-width="20%"></el-table-column>
                <el-table-column prop="extract" label="Definition" min-width="80%"></el-table-column>
            </el-table>
            <div style="text-align: center;margin-top: 30px;">
                <el-pagination
                        background
                        layout="prev, pager, next"
                        :total= "defList.length"
                        @current-change="currentChange" v-if="seen" :current-page.sync="currentPage" :page-size.sync="pageSize">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import Axios from 'axios';
    export default {
        name: "TermExplanationTool",
        data() {
            return {
                textarea1:'',
                definition: {},
                highLight: '',
                wikiDef: {},
                defList: [],
                seen: false,
                currentPage: 1,
                pageSize: 5,
                fullscreenLoading: false
            }
        },
        methods:{
            currentChange(currentPage) {
                this.currentPage = currentPage;
            },
            getDefinition(){
                this.highLight = ''
                this.definition = {}
                this.wikiDef = []
                this.defList = []
                this.fullscreenLoading = true;
                Axios.get(' https://slb4y23av1.execute-api.us-west-2.amazonaws.com/dev/term-explanation',{params: {query: this.textarea1}}).then(
                    response => {
                        this.definition = response.data
                        this.highLight = this.definition['render']
                        this.wikiDef = this.definition['wiki']
                        this.extractDefinition()
                        this.seen = true
                        this.fullscreenLoading = false;
                    },
                    error => {
                        console.log(error.data)
                    }
                )
            },
            clearInput(){
                this.textarea1 = ''
                this.seen = false
            },
            extractDefinition() {
                let pageIdList = []
                for(let item of this.wikiDef) {
                    if(!pageIdList.includes(item['pageid']) && !item['extract'].includes('may refer to:')) {
                        item['extract'] = item['extract'].split('\n')[0]
                        this.defList.push(item)
                        pageIdList.push(item['pageid'])
                    }
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    #term-explain
        .term-explanation-main
            display flex
            .term-tool-instruction
                margin-top 20px
                font-family Cambria
                width 45%
                .instruction-text
                    line-height 30px
            .input-box
             margin-top 20px
            .term-button
                margin-top 5px
                margin-left 10px
                float right
            .term-explanation-result
                width 45%
                flex 1
                margin-top 20px
                margin-left 20px
                font-family Cambria
                .term-highlight
                    .news-content
                        height auto
                        overflow auto
                        .highlight-result
                            width 90%
        .term-definition
            /deep/ .el-table td.el-table__cell div
                height auto
                overflow-y auto
</style>
