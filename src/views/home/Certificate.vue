<template>
<div class="container">
  <div class="banner"></div>
  <div class="area">
    <div>
      <div class="search">
        <el-input v-model="form.cerId" placeholder="请输入证书编号" @keyup.enter.native="search()"></el-input>
        <div class="button" @click="search">查询</div>
      </div>
      <div v-if="cert === null" class="nothing">
        <div class="fs-14 color-gray ta-center">
          <img src="@/assets/images/null.png">
          <div>暂未搜索到相关证书</div>
        </div>
      </div>
      <div class="result" v-if="cert != null && cert != undefined">
        <div>
          <div class="title">查询结果：</div>
          <div class="content">
            <div>证书编号：{{cert.cerId}}</div>
            <div>姓      名：{{cert.name}}</div>
            <div>性      别：{{cert.sex==0?'男':'女'}}</div>
            <div>职      称：—</div>
            <div>文化程度：{{cert.education}}</div>
            <div>身份证号：{{cert.idCard}}</div>
            <div>单位名称：{{cert.companyName}}</div>
            <div>培训类型：{{toTypeTxt(cert.eduType)}}</div>
            <div>有 效  期：自{{cert.startDate}}至{{cert.endDate}}</div>
          </div>
          <div class="contact">
            <div>培训机构名称：江苏安胜达安全科技有限公司</div>
            <div>联系方式：0512-62763925</div>
            <div>联系邮箱：training@asdsafe.cn</div>
            <div>公司官网：www.asdsafe.cn</div>
          </div>
        </div>
       <div class="resultImg">
           <div class="result-content">
             <div>证书编号：{{cert.cerId}}</div>
             <div>姓      名：{{cert.name}}</div>
             <div>性      别：{{cert.sex==0?'男':'女'}}</div>
             <div>职      称：—</div>
             <div>文化程度：{{cert.education}}</div>
             <div>身份证号：{{cert.idCard}}</div>
             <div>单位名称：{{cert.companyName}}</div>
             <div>培训类型：{{toTypeTxt(cert.eduType)}}</div>
             <div>有 效  期：自{{cert.startDate}}至{{cert.endDate}}</div>
           </div>
           <div class="result-contact">
             <div>培训机构名称：江苏安胜达安全科技有限公司</div>
             <div>联系方式：0512-62763925</div>
             <div>联系邮箱：training@asdsafe.cn</div>
             <div>公司官网：www.asdsafe.cn</div>
           </div>
       </div>
      </div>
    </div>
    <div></div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Certificate',
  data () {
    return {
      form: {
        cerId: '',
        pageNum: 1,
        pageSize: 1
      },
      cert: undefined
    }
  },
  methods: {
    toTypeTxt (type) {
      const array = ['安全管理员', '主要负责人', '班组长']
      if (type == null || type === undefined || type >= array.length || type < 0) {
        return '未知';
      }
      return array[type]
    },
    search () {
      if (!this.form.cerId) {
        this.$message.warning('请输入证书编号')
        return
      }
      this.$api.class.getCertList(this.form).then(res => {
        if (res.list.length === 0) {
          this.cert = null
        } else {
          this.cert = res.list[0]
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.banner{
  width: 100%;
  height: 280px;
  background: url("~@/assets/images/certificate.png") no-repeat center center;
  background-size:cover;
  margin-top: 20px;
}
.area{
  width: 1220px;
  background: #FFFFFF;
  border-radius: 8px;
  margin: -52px auto 0;
  padding: 20px 20px 0 20px;
  .search{
    display: flex;
    border-bottom: 1px dashed #D7D7D7 ;
    padding-bottom: 20px;
    .el-input{
      width: 90%;
      margin-right: 16px;
      /deep/.el-input__inner{
        background-color: #F8F8F8;
        height: 48px;
      }
    }
    .button{
      cursor: pointer;
      width: 112px;
      height: 48px;
      background: #09BBA1;
      border-radius: 8px;
      font-weight: 500;
      color: #FFFFFF;
      font-size: 16px;
      text-align: center;
      line-height: 48px;
      &:hover{
        background: #48D1CC;
        border-color: #48D1CC;
        color: #fff;
      }
    }
  }
  .nothing{
    padding: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .result{
    padding: 30px;
    display: flex;
    align-items: center;
    .title{
      font-weight: 500;
      color: #333333;
      font-size: 16px;
      margin-bottom: 26px;
    }
    .content{
      color: #333333;
      font-size: 14px;
      margin-bottom: 28px;
      div{
        margin-bottom: 16px;
      }
    }
    .contact{
      color: #666666;
      font-size: 12px;
      div{
        margin-bottom: 12px;
      }
    }
    .resultImg{
      width: 278px;
      height: 418px;
      margin-left: 100px;
      background: url("~@/assets/images/resultImg.png") no-repeat center center;
      background-size: contain;
      color: #193D58;
      position: relative;
      line-height: 24px;
      padding: 10px;
      .result-content{
        font-size: 9px;
        -webkit-transform: scale(0.9);
        position: absolute;
        top:80px;
        left: 32px;
      }
      .result-contact{
        font-size: 8px;
        -webkit-transform: scale(0.8);
        color: #5B88AA;
        position: absolute;
        bottom: 50px;
        left: 20px;
      }
    }
  }
}
</style>
