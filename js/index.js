// 初始化时检查登录状态
checkLogin();
// 渲染用户名
renderUsername();

// 退出登录
document.querySelector('#logout').addEventListener('click', () => {
  console.log('退出登录');
  logout();
})

// getData();

// 薪资走势
function renderYearSalary(year) {
  //    初始化echarts实例
  const dom = document.querySelector("#line")
  const myChart = echarts.init(dom)
  //  定义选项和数据
  const option = {
    // 标题
    title: {
      text: "2023全学科薪资走势",
      //   距离容器左侧和顶部的距离
      left: '15',
      top: '15'
    },
    // 提示框组件
    tooltip: {
      show: true,
      //    触发方式
      trigger: "axis"
    },
    // 绘制网格
    grid: {
      top: '20%'
    },
    // x轴
    xAxis: {
      // 坐标轴类型  category 类目轴
      type: 'category',
      //   坐标轴轴线相关设置
      axisLine: {
        lineStyle: {
          // 线的类型
          type: "dashed",
          //    线的颜色  颜色更改之后 文字也会跟着一起变色
          color: "#ccc"
        }
      },
      data: year.map(v => v.month)
    },
    // y轴
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: "dashed"
        }
      }
    },
    // 系列列表
    series: [
      {
        data: year.map(v => v.salary),
        // 折线图
        type: 'line',
        // 标记大小
        symbolSize: 10,
        // 线的样式
        lineStyle: {
          // 线宽
          width: 8,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0, color: '#5b7af0' // 0% 处的颜色
              },
              {
                offset: 0.5, color: '#5091ef' // 50% 处的颜色
              },
              {
                offset: 1, color: '#4a9dee' // 100% 处的颜色
              }],
            global: false // 缺省为 false
          }
        },
        // 是否平滑曲线显示
        smooth: true,
        // 区域填充样式
        // 区域填充样式
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0, color: '#4b99ee' // 0% 处的颜色
              },
              {
                offset: 0.5, color: '#d4e8fb' // 50% 处的颜色
              },
              {
                offset: 1, color: '#fff' // 100% 处的颜色
              }],
            global: false // 缺省为 false
          }
        }
      }
    ]
  };

  //   基于选项和数据绘制图表
  myChart.setOption(option)
}

// 薪资分布
function renderSalary(salaryData) {
  const dom = document.querySelector("#salary")
  const myChart = echarts.init(dom)
  let option = {
    title: {
      text: "班级薪资分布",
      left: 10,
      top: 15
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '5%',
      left: 'center'
    },
    series: [
      {
        name: '班级薪资分布',
        type: 'pie',
        //数组的第一项是内半径  第二项是外半径
        radius: ['55%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          //半径
          borderRadius: 15,
          //颜色
          borderColor: '#fff',
          //粗细
          borderWidth: 10
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 60,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: salaryData.map(v => {
          return {
            value: v.g_count + v.b_count,
            name: v.label
          }
        })
        // data: [
        //   { value: 1048, name: 'Search Engine' },
        //   { value: 735, name: 'Direct' },
        //   { value: 580, name: 'Email' },
        //   { value: 484, name: 'Union Ads' },
        //   { value: 300, name: 'Video Ads' }
        // ]
      }
    ],
    // 颜色
    color: ['red', 'yellow', 'blue', 'green']
  };
  myChart.setOption(option)
}

// 班级每组薪资
function renderGroupSalary(groupData) {
  const dom = document.querySelector("#lines")
  const myChart = echarts.init(dom)
  let option = {
    //绘图网格
    grid: {
      left: 70,
      top: 30,
      right: 30,
      bottom: 50
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: groupData[1].map(v => v.name),
      //   线的类型  颜色  文字的颜色
      axisLine: {
        lineStyle: {
          color: "#ccc",
          type: "dashed"
        }
      },
      axisLabel: {
        // 刻度标签文字的颜色
        color: "#999"
      }
    },
    yAxis: {
      type: 'value',
      // 分割线和类型
      splitLine: {
        lineStyle: {
          type: "dashed"
        }
      }
    },
    series: [
      {
        name: "期望薪资",
        data: groupData[1].map(v => v.hope_salary),
        type: 'bar',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#41d7a1' // 0% 处的颜色
            }, {
              offset: 1, color: '#bcf1de' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      },
      {
        name: "实际薪资",
        data: groupData[1].map(v => v.salary),
        type: 'bar',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#53a5ef' // 0% 处的颜色
            }, {
              offset: 1, color: '#cde5fa' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      }
    ]
  };
  myChart.setOption(option)

  //    高亮切换
  const btns = document.querySelector("#btns")
  btns.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn')) {
      // console.log("点击了按钮")
      btns.querySelector('.btn-blue').classList.remove('btn-blue')
      e.target.classList.add('btn-blue')
      // 数据切换
      // 获取属性名
      const index = e.target.innerText
      console.log(index)
      const data = groupData[index]
      option.xAxis.data = data.map(v => v.name)
      option.series[0].data = data.map(v => v.hope_salary)
      option.series[1].data = data.map(v => v.salary)

      // 重新渲染
      myChart.setOption(option)
    }
  })
}


// 男女薪资分布
function renderGenderSalary(salaryData) {


  const dom = document.querySelector("#gender")
  const myChart = echarts.init(dom)
  let option = {
    // 标题
    title: [
      {
        text: "男女薪资分布",
        left: 10,
        top: 10,
        textStyle: {
          fontSize: 20
        }
      },
      {
        text: "女生",
        left: 'center',
        top: '45%'
      },
      {
        text: "男生",
        left: 'center',
        top: '85%',
        textStyle: {
          fontSize: 12
        }
      }
    ],
    tooltip: {
      trigger: 'item'
    },
    // legend: {
    //   top: '5%',
    //   left: 'center'
    // },
    color: ['red', 'blue', 'green', 'orange'],
    series: [
      {
        type: 'pie',
        radius: ['20%', '30%'],
        center: ['50%', '30%'],
        labelLine: {
          show: true
        },
        data: salaryData.map(v => {
          return { value: v.g_count, name: v.label }
        })
      },
      {
        type: 'pie',
        radius: ['20%', '30%'],
        center: ['50%', '70%'],
        labelLine: {
          show: true
        },
        data: salaryData.map(v => {
          return { value: v.b_count, name: v.label }
        })
      }
    ]
  };

  myChart.setOption(option)
}

// 籍贯分布
function renderPrivince(provinceData) {
  const dataList = [
    { name: '北京', value: 0 },
    { name: '天津', value: 0 },
    { name: '上海', value: 0 },
    { name: '重庆', value: 0 },
    {
      name: '河北',
      value: 0
    },
    {
      name: '河南',
      value: 0
    },
    {
      name: '云南',
      value: 0
    },
    {
      name: '辽宁',
      value: 0
    },
    {
      name: '黑龙江',
      value: 0
    },
    {
      name: '湖南',
      value: 0
    },
    {
      name: '安徽',
      value: 0
    },
    {
      name: '山东',
      value: 0
    },
    {
      name: '新疆',
      value: 0
    },
    {
      name: '江苏',
      value: 0
    },
    {
      name: '浙江',
      value: 0
    },
    {
      name: '江西',
      value: 0
    },
    {
      name: '湖北',
      value: 0
    },
    {
      name: '广西',
      value: 0
    },
    {
      name: '甘肃',
      value: 0
    },
    {
      name: '山西',
      value: 0
    },
    {
      name: '内蒙古',
      value: 0
    },
    {
      name: '陕西',
      value: 0
    },
    {
      name: '吉林',
      value: 0
    },
    {
      name: '福建',
      value: 0
    },
    {
      name: '贵州',
      value: 0
    },
    {
      name: '广东',
      value: 0
    },
    {
      name: '青海',
      value: 0
    },
    {
      name: '西藏',
      value: 0
    },
    {
      name: '四川',
      value: 0
    },
    {
      name: '宁夏',
      value: 0
    },
    {
      name: '海南',
      value: 0
    },
    {
      name: '台湾',
      value: 0
    },
    {
      name: '香港',
      value: 0
    },
    {
      name: '澳门',
      value: 0
    },
  ]


  dataList.forEach(item => {
    const res = provinceData.find(v => {
      return v.name.includes(item.name)
    })
    if (res !== undefined) {
      item.value = res.value
    }
  })
  console.log(dataList)

  const dom = document.querySelector("#map")
  const myChart = echarts.init(dom)


  let option = {
    visualMap: {
      min: 0,
      max: 1000,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      calculable: false,
      orient: 'horizontal',
      inRange: {
        color: ['#e0ffff', '#006edd'],
        symbolSize: [30, 100]
      }
    },
    // tooltip: {
    //     padding:8,
    //     enterable: true,
    //     transitionDuration: 1,
    //     textStyle: {
    //         color: '#fff',
    //         decoration: 'none',
    //     }
    // },
    series: [{
      name: '接入医院数量',
      type: 'map',
      mapType: 'china',
      itemStyle: {
        normal: {
          label: {
            show: false
          }
        },
        emphasis: {
          label: {
            show: true
          }
        }
      },
      label: {
        normal: { //静态的时候展示样式
          show: true, //是否显示地图省份得名称
          textStyle: {
            color: "#fff",
            fontSize: 12
          }
        },
        emphasis: { //动态展示的样式
          color: '#f00',
        },
      },
      data: dataList

    },]
  }
  myChart.setOption(option)
}