// axios请求拦截器
axios.interceptors.request.use(config => {
  config.baseURL = 'https://hmajax.itheima.net/';
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token; // 有token就加上token
  }
  return config;
});


// axios响应拦截器
axios.interceptors.response.use(response => {
  if (response.config.url !== 'dashboard') {
    showToast(response.data.message); // message提示
  }
  console.log(response, '响应数据');
  return response.data;
}, err => {
  // 请求失败
  if (err.response.status === 401) {
    showToast('请重新登录');
    localStorage.removeItem('token');
    toRoute('./login.html', 1500); // 跳转
  } else {
    showToast(err.response.data.message);
  }
  return Promise.reject(err);
})


// 跳转页面(参数url: 跳转地址, time: 延迟时间)
function toRoute(url, time = 1000) {
  setTimeout(() => {
    location.href = url;
  }, time)
}


// message提示
function showToast(message) {
  const toastDom = document.querySelector('.toast'); // 获取toast元素
  document.querySelector('.toast-body').innerText = message; // 设置提示内容
  const toast = new bootstrap.Toast(toastDom); // 创建toast
  toast.show(); // 显示toast
};


// 登录注册
async function loginAndRegister(event, url = 'login' || 'register') {
  // 收集fome 数据
  const formDom = document.querySelector('.form');
  const data = serialize(formDom, { empty: true, hash: true });

  // 长度校验
  const { username, password } = data;
  if (username.length < 6 || username.length > 16) {
    showToast('用户名长度不能小于6位, 大于16位');
    return;
  }
  if (password.length < 6 || password.length > 16) {
    showToast('密码长度不能小于6位, 大于16位');
    return;
  }

  // 发起请求
  const { data: { token, username: uname } } = await axios.post(url, data);
  if (token) {
    // 存储token 和 用户名
    localStorage.setItem('token', token);
    localStorage.setItem('username', uname);
    toRoute('./index.html', 1500);
  }
}


// 获取仪表盘数据
async function getDashboard() {
  const { data: { groupData, overview, provinceData, salaryData, year } } = await axios.get('dashboard');  // 获取数据
  // 渲染基本数据
  rendenOverview(overview);
  // 渲染年薪走势
  rendenYear(year);
  // 渲染月薪饼图
  renderSalaryData(salaryData);
  // 渲染班级薪资柱状图
  rendenGroupData(groupData);
  // 渲染男女薪资
  renderSexSalary(salaryData);
  // 渲染省份分布
  renderProvinceData(provinceData);
}


// 登录状态检测
async function checkLogin() {
  if (localStorage.getItem('token')) {
    // 获取仪表盘数据(token无效会退出登录)
    getDashboard();
    return;
  }
  showToast('用户未登录');
  // 跳转页面(参数延迟单位毫秒)
  toRoute('./login.html', 1500);
}


// 用户名渲染
function renderUsername() {
  const username = localStorage.getItem('username') || '未登录';
  console.log(username);
  document.querySelector('#user').innerText = username;
};


// 提出登录
function logout() {
  // 删除本地存储的用户名和token
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  location.href = './login.html';
}


// 渲染薪资走势
function rendenYear(data) {
  const myChart = echarts.init(document.querySelector('#line'));
  const option = {
    title: {
      top: "15",
      left: "6%",
      text: "2023全学科薪资走势",
    },

    grid: {
      top: "15%",
    },

    tooltip: {
      trigger: "axis",
    },

    xAxis: {
      type: "category",
      data: data.map(item => item.month),
      axisLine: {
        lineStyle: {
          type: "dashed",
          color: "#ccc",
        }
      }
    },

    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          type: "dashed",
        },
      },
    },

    series: [
      {
        data: data.map(v => v.salary),
        type: "line",
        smooth: true, // 折线是否平滑
        symbolSize: 8,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'skyblue' }, // 0% 处的颜色
              { offset: 1, color: 'rgba(255,255,255,0)' }, // 100% 处的颜色
            ],
            global: false, // 缺省为 false
          },
        },
        lineStyle: {
          width: 5,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: 'blue' }, // 0% 处的颜色
              { offset: 1, color: 'skyblue' }, // 100% 处的颜色
            ],
          }
        }
      },
    ],
  };
  myChart.setOption(option);
}

// 渲染概览
function rendenOverview(overview) {
  Object.keys(overview).forEach(key => {
    console.log(key, overview[key]);
    document.querySelector(`.${key}`).innerText = overview[key];
  })
}

// 渲染月薪饼图
function renderSalaryData(salaryData) {
  const myChart = echarts.init(document.querySelector('#salary'));
  const option = {
    title: {
      text: '班级薪资分布',
      top: 15,
      left: 10,
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '10%',
      left: 'center'
    },
    series: [
      {
        name: '班级薪资分布',
        type: 'pie',
        radius: ['60%', '70%'],
        // avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 15,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          // position: 'center'
        },
        // labelLine: {
        //   show: true
        // },
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: 26,
        //     fontWeight: 'bold'
        //   }
        // },
        data: salaryData.map(v => ({ name: v.label, value: v.g_count + v.b_count }))
      }
    ],
    color: ['antiquewhite', 'khaki', 'aquamarine', 'lightskyblue', 'chartreuse'],
    global: false // 缺省为 false
  };
  myChart.setOption(option);
}

// 渲染班级薪资柱状图
function rendenGroupData(groupDatas) {
  const groupData = groupDatas;  // 存储数据
  const btnsDom = document.querySelector('#btns') // 获取所有按钮
  let oldIndex = 1;  // 默认点击按钮的值
  const myChart = echarts.init(document.querySelector('#lines')); // 获取图表
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      data: groupData['1'].map(v => v.name)
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '期望薪资',
        type: 'bar',
        barWidth: '33%',
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0, color: 'skyblue' // 0% 处的颜色
            },
            {
              offset: 1, color: '#ccc' // 100% 处的颜色
            }
          ],
          global: false // 缺省为 false
        },
        data: groupData['1'].map(v => v.salary)
      },
      {
        name: '实际薪资',
        type: 'bar',
        barWidth: '33%',
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0, color: 'aquamarine' // 0% 处的颜色
            },
            {
              offset: 1, color: '#ccc' // 100% 处的颜色
            }
          ],
          global: false // 缺省为 false
        },
        data: groupData['1'].map(v => v.hope_salary)
      }
    ]
  };
  myChart.setOption(option);

  // 事件委托(选项卡)
  btnsDom.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn')) {
      // 重复点击
      if (oldIndex == e.target.innerText) {
        return
      }

      oldIndex = e.target.innerText; // 存储点击的按钮

      // 修改样式(高亮)
      btnsDom.querySelector('.btn-blue').classList.remove('btn-blue'); // 移除高亮
      e.target.classList.add('btn-blue'); // 添加高亮

      // 修改并渲染图表
      const data = groupData[e.target.innerText]; // 获取数据
      option.xAxis.data = data.map(v => v.name);
      option.series[0].data = data.map(v => v.salary);
      option.series[1].data = data.map(v => v.hope_salary);
      myChart.setOption(option);
    }
  });
}


// 渲染男女薪资
function renderSexSalary(Data) {
  const myChart = echarts.init(document.querySelector('#gender'));
  const option = {
    title: [
      {
        text: '男女薪资分布',
        top: 10,
        left: 10,
        textStyle: {
          fontSize: '18'
        }
      },
      {
        text: '男生',
        top: '40%',
        left: 'center',
        textStyle: {
          fontSize: '16'
        }
      },
      {
        text: '女生',
        top: '80%',
        left: 'center',
        textStyle: {
          fontSize: '16'
        }
      }
    ],
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '男性',
        type: 'pie',
        radius: ['20%', '30%'],
        center: ['50%', '25%'],
        // avoidLabelOverlap: false,
        // label: {
        //   show: false,
        //   position: 'center'
        // },
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: 20,
        //     fontWeight: 'bold'
        //   }
        // },
        // labelLine: {
        //   show: false
        // },
        data: Data.map(v => ({ name: v.label, value: v.b_count }))
      },
      {
        name: '女性',
        type: 'pie',
        radius: ['20%', '30%'],
        center: ['50%', '65%'],
        // avoidLabelOverlap: false,
        // label: {
        //   show: false,
        //   position: 'center'
        // },
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: 20,
        //     fontWeight: 'bold'
        //   }
        // },
        // labelLine: {
        //   show: false
        // },
        data: Data.map(v => ({ name: v.label, value: v.g_count }))
      }
    ]
  };
  myChart.setOption(option);
}

// 渲染省份分布
function renderProvinceData(Data) {
  // 处理数据
  const outdata = Data.map(({ name, value }) => {
    // 黑龙江和内蒙古(获取省份名前三位)
    if (name.includes('黑龙江') || name.includes('内蒙古')) {
      return {
        name: name.slice(0, 3),
        value
      }
    };
    // 其他省份默认(获取省份名前两位)
    return {
      name: name.slice(0, 2),
      value
    };
  });
  console.log(outdata);
  const myChart = echarts.init(document.querySelector('#map'));
  const option = {
    tooltip: {
      show: true,
      // 提示框数据显示处理(有数据就显示，没有数据就显示0)
      formatter: function (params) {
        if (params.value) {
          return '&nbsp;&nbsp;' + params.name + '&nbsp;&nbsp;&nbsp;' + params.value + '个&nbsp;&nbsp;';
        } else {
          return '&nbsp;&nbsp;' + params.name + '&nbsp;&nbsp;&nbsp;0个&nbsp;&nbsp;';
        }
      }
    },
    visualMap: {
      // 方向
      // orient: 'horizontal',
      min: 0,
      max: 100,
      itemWidth: 10,
      itemHeight: 89,
      left: '20',
      bottom: '10',
      text: ['高', '低'],
      textStyle: {
        color: '#666666',
        fontSize: 13,
      },
      inRange: {
        color: ['#D9EEFF', '#2F9BFF']
      },
      outOfRange: {
        show: false,
      }
    },

    geo: {
      map: 'china',
      show: true,
      roam: false,
      label: {
        emphasis: {
          show: false
        }
      },
      itemStyle: {
        normal: {
          show: false
        }
      }
    },
    series: [{
      type: 'map',
      map: 'china',
      aspectScale: 0.75,
      //zoom:1.1,
      label: {
        normal: {
          formatter: function (para) {
            return '{name|' + para.name + '}'
          },
          rich: {
            cnNum: {
              fontSize: 11,
              color: '#333333',
              align: 'center',
            },
            name: {
              fontSize: 11,
              color: '#333333',
              align: 'center',
              lineHeight: 20,
            },
          },
          //formatter: '{b}',
          color: '#333333',
          show: true
        },
        // 鼠标移动到省份上是否显示省份名称
        emphasis: {
          show: true,
        }
      },
      itemStyle: {
        normal: {
          areaColor: '#D9EEFF',
          borderColor: '#fff',
          borderWidth: 1,
        },
        emphasis: {
          areaColor: '#FFAE00',
        }
      },
      data: outdata
    }]
  };
  myChart.setOption(option);
};