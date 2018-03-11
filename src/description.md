# MD Markdown 编辑器

一个轻量的 markdown 编辑器: [https://wy-ei.github.io/md](https://wy-ei.github.io/md)

<img src="http://7xs1gu.com1.z0.glb.clouddn.com/18-3-10/1361618.jpg" style="display:block;margin:auto;" >


本项目最早开始于 2015 年，那时候只是为了生成自己的简历。使用 markdown 编辑，并自定义 HTML 样式，随后使用浏览器自带打印功能打印为 PDF。随后不断增强和重写，目的在于增强编辑体验，优化预览样式，现在我用它：

- 编写邮件：使用 markdown 编辑好，而后拷贝预览内容至邮箱编辑区。
- 撰写文档：使用 markdown 写好文档，生成 PDF 发给同事。
- 编辑微信公众号内容：搜索资料，编辑文章，之后拷贝预览内容至微信后台，完成排版。

## 功能介绍

### 1. Markdown 实时预览

高效地编辑预览 Markdown。

### 2. Check list

- [x] 支持公式编辑
- [ ] 支持编辑/预览区域同步滚动
- [x] 增加代码高亮功能
- [ ] 增加图床功能

### 3. 编写公式

使用 [KaTeX](https://khan.github.io/KaTeX/) 渲染数学公式，行内公式：$a+b = c$，块状公式：

$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$

### 4. 代码高亮

```python
class Student(object):
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def print_score(self):
        print('%s: %s' % (self.name, self.score))
```

### 5. 绘制图表

使用代码块，设置语言为 `chart` 即可输入 `JSON` 配置项，使用 [Chart.js](http://www.chartjs.org/docs/latest/getting-started/usage.html) 生成图表。使用此功能需要懂一些 JavaScript，如果看不懂可以跳过。

```chart
{
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
}
```

### 5. 打印成 PDF

借用浏览器的打印功能，可以将文档打印为排版精美的 PDF，只需点击右上角的 `打印` 按钮。

### 6. 暂存

在编辑过程中，可以将当前编辑区域中的内容暂存起来，在之后可以根据时间恢复到该版本。

**注意**：所有内容存储在本地，所有数据均存储在本地浏览器中，清除浏览器记录、更换浏览器都会导致数据丢失，此编辑器只适合临时编辑预览。


## 建议

如有任何建议，请在此项目的 [issues](https://github.com/wy-ei/md/issues) 中提出。
