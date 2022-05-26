<template>
    <div id="fake-detection">
        <div class="fake-detection-main">
            <div class="fake-detection-instruction">
                <h3>What is Fake News Detection?</h3>
                <div class="instruction-text"> Do you get tired with the fake news on today's social media? You need a
                    fake news detection
                    tool to help you bust all the fake news no matter where they are, please try our powerful and new
                    Fake News Detector today.
                </div>
                <div>
                    <div class="input-box">
                        <el-input
                                type="textarea"
                                rows="20"
                                placeholder="Please Enter the news Content"
                                v-model="textarea1">
                        </el-input>
                        <div class="fake-button">
                            <el-button type="danger" @click="clearInput" v-loading.fullscreen.lock="fullscreenLoading">
                                Clear
                            </el-button>
                            <el-button type="primary" @click="getDefinition()">Submit</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fake-news-probability">
                <h3 style="font-family: Cambria">Fake News Probability</h3>
                <div v-if="seen">
                    <div class="instruction-text"> You can check the probability of the news content to check if it is
                        true or fake, the result of the detection is only for your reference, the result might not be
                        100% accurate.
                    </div>
                    <div style="text-align: center">
                        <el-progress type="dashboard" :percentage=Math.round(((1-this.probability)*100)) :width=250
                                     :show-text="true" color="#f56c6c" :format="fakeFormat"
                                     class="percentage"></el-progress>
                        <el-progress type="dashboard" :percentage=Math.round((this.probability*100)) :width=250
                                     :show-text="true" color="#5cb87a" :format="realFormat"
                                     class="percentage"></el-progress>
                    </div>
                    <div class="Result" v-if="seen">
                        <h2 v-if="this.probability <= 0.2">This is a <span style="color: red; font-weight: bold">Fake News</span>
                            ! Please do not trust it at all!</h2>
                        <h2 v-if="this.probability > 0.2 && this.probability < 0.5">This might a <span
                                style="color: goldenrod; font-weight: bold">Fake News</span> ! Please refer to other
                            sources to check its credibility.</h2>
                        <h2 v-if="this.probability >= 0.5 && this.probability < 0.8">This could be a piece of <span
                                style="color: royalblue; font-weight: bold">Truth News</span> . You might trust it since
                            it looks like not a fake one.</h2>
                        <h2 v-if="this.probability >= 0.8">Wow this news is true <span
                                style="color: green; font-weight: bold">Truth News</span>. You find some clean space on
                            today's social media.</h2>
                    </div>
                    <div class="susResult">
                        <div class="fake-highlight"
                                 :style="[seen?{'height':'300px','width':'400px', 'overflow-y':'auto','float':'left'}:{'height':'0px'}]">
                            <h3 style="font-family: Cambria;">Suspicious Text Patterns</h3>
                            <div class="highlight-result" v-html="this.highLight" style="width: 90%"></div>
                        </div>
                        <div class="susRank"
                             :style="[seen?{'height':'300px','width':'200px','float':'left','margin-left':'50px'}:{'height':'0px'}]">
                            <h3 style="font-family: Cambria">Suspicious Word Ranking</h3>
                            <el-table :data="susList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                                      style="width: 100%" v-if="seen">
                                <el-table-column prop="index" label="Word Rank" min-width="50%"></el-table-column>
                                <el-table-column prop="word" label="Suspicious Words" min-width="50%"></el-table-column>
                            </el-table>
                            <div style="text-align: center;margin-top: 30px;">
                                <el-pagination
                                        background
                                        layout="prev, pager, next"
                                        :total="susList.length"
                                        @current-change="currentChange" v-if="seen" :current-page.sync="currentPage"
                                        :page-size.sync="pageSize">
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                </div>
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
                textarea1: '',
                result: {},
                highLight: '',
                probability: 0,
                susList: [],
                seen: false,
                currentPage: 1,
                pageSize: 3,
                fullscreenLoading: false
            }
        },
        methods: {
            currentChange(currentPage) {
                this.currentPage = currentPage;
            },
            getDefinition() {
                this.highLight = ''
                this.probability = 0
                this.susList = []
                this.fullscreenLoading = true
                Axios.get('https://laxch7kxnh.execute-api.us-east-1.amazonaws.com/dev/fake-detection', {params: {query: this.textarea1}}).then(
                    response => {
                        this.result = response.data
                        this.highLight = this.result['suspiciousWords']
                        this.probability = this.result['probability']
                        console.log(this.probability)
                        let index = 1
                        for (let word of this.result['susRank']) {
                            if ((/[a-zA-Z]/).test(word) && word.length > 3) {
                                this.susList.push({'index': index, 'word': word})
                                index++;
                            }
                        }
                        this.seen = true
                        this.fullscreenLoading = false;
                    },
                    error => {
                        alert("Connection Timeout, please submit your news again!")
                        this.fullscreenLoading = false;
                        console.log(error.data)
                    }
                )
            },
            fakeFormat(percentage) {
                return "Fake News " + percentage + "%"
            },
            realFormat(percentage) {
                return "Truth News " + percentage + "%"
            },
            clearInput() {
                this.textarea1 = ''
                this.seen = false
            }
        }
    }
</script>

<style lang="stylus" scoped>
    #fake-detection
        .fake-detection-main
            display flex

            .fake-detection-instruction
                width 45%
                margin-top 20px
                font-family Cambria

                .instruction-text
                    line-height 30px

                .input-box
                    margin-top 20px

                    .fake-button
                        margin-top 5px
                        margin-left 10px
                        float right

            .fake-news-probability
                font-family Cambria
                margin-top 20px
                margin-left 40px

                .percentage
                    margin-top 30px
                    margin-left 40px
                    margin-right 30px

                .Result
                    margin-top 40px
                    text-align center
                    margin-left 10px
                    margin-right 10px
</style>
