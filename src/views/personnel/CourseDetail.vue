<template>
  <div class="container">
    <el-container>
      <el-header class="padding-0 display-flex ai-center">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/personnel/course-list' }">课程列表</el-breadcrumb-item>
          <el-breadcrumb-item>课程详情</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-container>
        <el-aside class="aside" width="300px" style="height: 642px;">
          <el-menu
            :default-active="activeName"
            active-text-color="#1990FF"
            text-color="#333333"
            mode="horizontal"
            @select="(val) => {activeName = val}">
            <el-menu-item index="chapter">章节</el-menu-item>
            <el-menu-item index="exam">考试</el-menu-item>
          </el-menu>
          <div class="scrollbar chapter padding-16" v-if="activeName === 'chapter'">
            <div class="title">
              <i class="el-icon-tickets"></i>
              <span class="text-overflow">{{title}}</span>
            </div>
            <el-scrollbar style="height: 500px;">
              <ul class="list">
                <li v-for="(item, index) in chapterList" :key="index">
                  <el-link :type="item.checked ? 'primary' : item.ended === '1' ? 'info' : 'default'" :underline="false" @click="clickLink(item)">
                    <span class="flex-1 ta-left">章节{{index + 1}}</span>
                    <span class="flex-2 text-overflow">{{item.title}}</span>
                    <span class="flex-1 ta-right">{{item.time}}</span>
                  </el-link>
                </li>
              </ul>
            </el-scrollbar>
          </div>
          <div v-else class="exam" style="height: 500px;">
            <div v-if="state" class="display-flex ai-center fd-column jc-center pt-20">
              <img class="mt-20" :src="imgTrue" alt="">
              <p class="color-info fs-14 mt-20">课程已学完，请开始考试！</p>
              <div class="go-exam display-flex ai-center jc-space-around mt-20">
                <div class="display-flex ai-center jc-space-between">
                  <img class="mr-10" :src="imgTest" alt="">
                  <p class="fs-16">考试测验</p>
                </div>
                <el-button size="mini" type="primary" round @click="$router.push(`/personnel/exam/${$route.params.id}`)">去考试</el-button>
              </div>
              <div class="last-score" v-if="lastScore">
                <p class="fs-14">您上次的考试成绩为(分)</p>
                <span class="fs-20 color-primary">{{lastScore}}</span>
                <el-button class="width-percent-50" size="mini" type="primary" plain round @click="$router.push(`/personnel/exam-detail/${$route.params.id}`)">查看得分详情<i class="el-icon-arrow-right
 el-icon--right"></i></el-button>
              </div>
            </div>
            <div v-else class="height-percent-100 display-flex ai-center fd-column jc-center">
              <img :src="emptyState" alt="">
              <p class="color-info fs-14 mt-20">课程未全学习完，暂不能考试</p>
            </div>
          </div>
        </el-aside>
        <el-main class="padding-0 pl-20">
          <div class="main padding-20">
            <div class="title fs-18 mb-20 display-flex ai-center">
              <i class="el-icon-video-camera-solid mr-14 color-success fs-20"></i>
              <h5 class="text-overflow margin-0">当前播放：{{videoTitle}}</h5>
            </div>
            <video-player
              :key="videoData.id"
              @ended="onPlayerEnded"
              @timeupdate="onPlayerTimeupdate"
              @ready="playerReadied"
              v-if="playerOptions.sources[0].src"
              ref="videoPlayer"
              :options="playerOptions"
              :playsinline="true">
            </video-player>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import { videoPlayer } from 'vue-video-player'
import emptyState from '@/assets/images/empty-state.png'
import imgTest from '@/assets/images/test.png'
import imgTrue from '@/assets/images/true.png'

export default {
  name: 'CourseDetail',
  data () {
    return {
      index: 0,
      emptyState, // 空图
      imgTest, // 去考试的图
      imgTrue, // 对勾图
      activeName: 'chapter',
      title: '', // 课程名
      state: false, // 课程状态
      examState: '', // 考试状态
      lastScore: null, // 上次成绩
      videoTitle: '', // 视频上方的标题
      videoData: {}, // 记录数据用
      playerOptions: {
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: '', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
          src: '' // url地址
        }],
        poster: '', // 你的封面地址
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          currentTimeDisplay: true, // 当前播放位置
          timeDivider: true, // 时间分割线
          durationDisplay: true, // 总时间
          progressControl: true, // 进度条
          remainingTimeDisplay: true, // 剩余时间
          fullscreenToggle: true // 全屏按钮
        }
      },
      chapterList: [] // 章节列表
    }
  },
  components: {
    videoPlayer
  },
  watch: {},
  computed: {},
  methods: {
    // 视频播完回调
    onPlayerEnded (e) {
      this.videoData.lastView = parseInt(e.cache_.currentTime)
      const data = {
        courseId: this.$route.params.id,
        ended: 1,
        sectionId: this.videoData.id,
        viewTime: 0
      }
      this.index = this.chapterList.findIndex(item => item.checked)
      this.updateVideoTime(data).then(() => {
        this.getCourseChapterList(false)
        this.getCourseState()
      })
    },
    // 当前播放位置发生变化时触发。
    onPlayerTimeupdate (e) {
      // 60s记录一次时间点
      if (parseInt(e.cache_.currentTime) - this.videoData.lastView >= 60) {
        this.videoData.lastView = parseInt(e.cache_.currentTime)
        const data = {
          courseId: this.$route.params.id,
          ended: this.videoData.ended,
          sectionId: this.videoData.id,
          viewTime: this.videoData.lastView
        }
        this.updateVideoTime(data).then(() => {
          this.getCourseState()
        })
      }
    },
    playerReadied (player) {
      player.currentTime(this.videoData.lastView)
    },
    updateVideoTime (data) {
      return new Promise((resolve, reject) => {
        this.$api.course.updateVideoTime(data).then(res => {
          resolve(res);
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
       * 点击章节
       * @param data {Object}
       */
    clickLink (data) {
      this.chapterList.forEach(item => {
        item.checked = false
      })
      data.checked = true
      this.videoData = data
      this.playerOptions.sources[0].src = data.sectionUrl
      this.playerOptions.controlBar.progressControl = data.ended === '1'
      this.videoTitle = `章节${this.chapterList.indexOf(data) + 1} ${data.title}`
    },
    /**
       * 获取章节列表
       */
    getCourseChapterList (state = true) {
      this.$api.course.getCourseChapterList({ courseId: this.$route.params.id }).then(res => {
        this.title = res.title
        this.chapterList = res.section_list.map((item, index) => {
          return {
            ...item,
            checked: this.index === index,
            time: `${parseInt(item.vediotime / 60)}'${parseInt(item.vediotime % 60)}`
          }
        }) || []
        if (this.chapterList.length && state) {
          const index = this.chapterList.findIndex(item => item.ended === '0') > -1 ? this.chapterList.findIndex(item => item.ended === '0') : 0
          this.chapterList[index].checked = true
          this.videoData = this.chapterList[index]
          this.playerOptions.sources[0].src = this.chapterList[index].sectionUrl
          this.playerOptions.controlBar.progressControl = this.chapterList[index].ended === '1'
          this.videoTitle = `章节${index + 1} ${this.chapterList[index].title}`
        }
      })
    },
    // 获取课程状态
    getCourseState () {
      this.$api.course.getCourseState({ courseId: this.$route.params.id }).then(res => {
        this.state = !(res === '0' || res === '-1')
      })
    },
    // 获取课程考试状态
    getCourseExamState () {
      this.$api.course.getCourseExamState({ courseId: this.$route.params.id }).then(res => {
        this.examState = res.status
        this.lastScore = res.score
      })
    }
  },
  created () {
  },
  mounted () {
    this.getCourseChapterList()
    this.getCourseState()
    this.getCourseExamState()
  }
}
</script>

<style lang="scss" scoped>
  .aside {
    border: 1px solid rgba(229, 229, 229, 1);
    background: rgba(255, 255, 255, 1);

    .el-menu-item {
      font-size: 16px;
      margin: 0 calc(25% - 20px);
      padding: 0 4px;
      text-align: center;
      height: 50px;
      line-height: 50px;
    }

    .chapter {
      .title {
        width: calc(100% - 28px);
        height: 22px;
        background: rgba(247, 247, 247, 1);
        display: flex;
        align-items: center;
        padding: 14px;
        border-radius: 4px;

        i {
          font-size: 16px;
          margin-right: 12px;
        }
      }

      .list {
        color: #666666;
        padding: 10px;

        li {
          padding: 10px 0;

          /deep/ .el-link {
            width: 100%;

            .el-link--inner {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
          }
        }
      }
    }
    .exam {
      .go-exam {
        width:270px;
        height:85px;
        background:rgba(242,249,255,1);
        border-radius:4px;
      }
      .last-score {
        margin-top: 20px;
        border-top: 1px dashed #D9D9D9;
        width: calc(100% - 30px);
        display: flex;
        flex-direction: column;
        align-items: center;
        span {
          margin-bottom: 15px;
        }
      }
    }
  }

  .main {
    width: auto;
    height: 600px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(229, 229, 229, 1);

    .video-player {
      /deep/ .video-js {
        width: 100%;
        height: 100%;
        display: block;
        position: relative;

        .vjs-big-play-button {
          width: 80px;
          height: 80px;
          position: absolute;
          border-radius: 50%;
          left: calc(50% - 40px);
          top: calc(50% - 40px);

          .vjs-icon-placeholder:before {
            top: 15px;
          }
        }
      }
    }
  }
</style>
