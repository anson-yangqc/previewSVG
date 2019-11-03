var fs = require('fs');
var gulp = require('gulp');
var path = require("path");
var relativePath = '\\src' //查询的文件夹名
var root = path.join(__dirname)+relativePath
var dataArr = []
var fileNameReg = /\.svg/g;// 找到.svg 文件  //正则fileNameReg.test('str') 返回true 会true=》false=》true=》false 这样轮着返回
// var fileNameReg = /\.css|\.svg|\.js|\.html|\.htm/g;// 找到 .css .html .js .svg 文件
gulp.task('getPaths', function () {
  readDirSync(root,createHtml)
});
// 使用异步获取路径
// 参数是遍历文件的根路径
function readDirSync(path,callback){
  var pa = fs.readdirSync(path);
  // 循环遍历当前的文件以及文件夹
  pa.forEach(function(ele,index){
    // console.log('ele',ele)
    var info = fs.statSync(path+"\\"+ele)  
    if(info.isDirectory()){
      console.log("dir: "+ele)
      readDirSync(path+"\\"+ele);
    }else{
      var filePath = path +'\\'+ ele;
      console.log('hrer=',filePath)
      let shouldFormat = filePath.lastIndexOf('.svg') >-1;
      console.log(filePath,shouldFormat)
      if (shouldFormat) {
        dataArr.push(filePath)
        // 这里就拿到了符合条件的文件路径，后面就可以根据这个路径来执行相关的操作
      }
    }  
  })
  callback && callback(dataArr)
}
function createHtml(dataArr){
  //无法创建文件夹
  var fileName = 'index.html'
  fs.writeFile(fileName,createTemplate(dataArr),function(err){
    if (err){
        console.log(err);
    } else{
        fs.readFile(fileName,(err,data)=>{
            if (err){
              console.log('err',err);
            }else{
              console.log('ok');
            }
        });
    }
  })
}
function createTemplate(dataArr){
  console.log('dataArr',dataArr)
  var imgs = ''
  for(var i=0;i<dataArr.length;i++){
    var opt = dataArr[i]
    var optName = getNameByFullPath(opt)
    imgs += `<div style='float:left;width:200px;height:100px;border:1px solid #f5f5f5; text-align:center;'>
              <img src='${opt}' />
              <div style='word-break: break-all;'>${optName}</div>
            </div>`
  }
  return `<html>
            <body>
              <div>
              ${imgs}
              </div>
            </body>
          </html>
        `
}
function getNameByFullPath(opt){
  const index  = opt.indexOf('\src')
  const length  = opt.length
  return opt.substr(index,length)
}