// weibo API
// 获取所有 weibo
var apiWeiboAll = function(callback) {
  var path = '/api/weibo/all'
  ajax('GET', path, '', callback)
}

var apiWeiboAdd = function(form, callback) {
  var path = '/api/weibo/add'
  ajax('POST', path, form, callback)
}

var apiWeiboDelete = function(weibo_id, callback) {
  var path = `/api/weibo/delete?id=${weibo_id}`
  ajax('GET', path, '', callback)
}

var apiWeiboUpdate = function(form, callback) {
  var path = '/api/weibo/update'
  ajax('POST', path, form, callback)
}

var apiCommentAdd = function(form, callback) {
  var path = '/api/weibo/comment_add'
  ajax('POST', path, form, callback)
}

var apiCommentDelete = function(comment_id, callback) {
  var path = `/api/weibo/comment_delete?id=${comment_id}`
  ajax('GET', path, '', callback)
}

var apiCommentUpdate = function(form, callback) {
  var path = '/api/weibo/comment_update'
  ajax('POST', path, form, callback)
}

var weiboTemplate = function(weibo) {
  // weibo DOM
  var t = `

                <span class="weibo-content">${weibo.content}</span>
                <button class="weibo-delete">删除</button>
                <button class="weibo-edit">编辑</button>
                <input class="weibo-commentContent">
                <button class="weibo-addComment">添加评论</button>

    `
  return t
}

var commentTemplate = function(comment) {

  var c = `
      <div class="comment-cell" data-id="${comment.id}">
          <span class="comment-content">${comment.content}</span>
          <button class="comment-delete">删除</button>
          <button class="comment-edit">编辑</button>
      </div>
  `

  return c
}

var joint = function(weibo, template) {

  var c = `
        <div class="weibo-cell" data-id="${weibo.id}">
        `

  c = c + template + '</div>'
  return c
}

var weiboUpdateTemplate = function(content) {
  // weibo DOM
  var t = `
        <div class="weibo-update-form">
            <input class="weibo-update-input" value="${content}">
            <button class="weibo-update">更新</button>
        </div>
    `
  return t
}

var insertWeibo = function(weibo) {
  var weiboCell = weiboTemplate(weibo)
  // 插入 weibo-list
  var weiboList = e('#id-weibo-list')
  weiboList.insertAdjacentHTML('beforeend', weiboCell)
}

var insertUpdateForm = function(content, weiboCell) {
  var updateForm = weiboUpdateTemplate(content)
  weiboCell.insertAdjacentHTML('beforeend', updateForm)
}

var insertComment = function(comment, weiboCell) {
  var commentForm = commentTemplate(comment)
  weiboCell.insertAdjacentHTML('beforeend', commentForm)
}

var insertUpdateCommentForm = function(content, commentCell) {
  var updateForm = commentUpdateTemplate(content)
  commentCell.insertAdjacentHTML('beforeend', updateForm)
}

var commentUpdateTemplate = function(content) {
  // weibo DOM
  var t = `
        <div class="comment-update-form">
            <input class="comment-update-input" value="${content}">
            <button class="comment-update">更新</button>
        </div>
    `
  return t
}

var loadWeibos = function() {
  // 调用 ajax api 来载入数据
  // Weibos = api_Weibo_all()
  // process_Weibos(Weibos)
  apiWeiboAll(function(r) {
    console.log('load all', r)
    // 解析为 数组
    var weibos = JSON.parse(r)
    // 循环添加到页面中
    for (var i = 0; i < weibos.length; i++) {
      var weibo = weibos[i]
      //使用了 let it be同学的思路
      template = weiboTemplate(weibo)
      comments = weibo.comments

      for (var j = 0; j < comments.length; j++) {
        var comment = comments[j]
        template = template + commentTemplate(comment)
        // log('template2', commentTemplate(comment))
        // log('template', template)
      }
      template = joint(weibo, template)
      var weiboList = e('#id-weibo-list')
      weiboList.insertAdjacentHTML('beforeend', template)
    }
  })
}

var bindEventWeiboAdd = function() {
  var b = e('#id-button-add')
  // 注意, 第二个参数可以直接给出定义函数
  b.addEventListener('click', function() {
    var input = e('#id-input-weibo')
    var content = input.value
    log('click add', content)
    var form = {
      content: content
    }
    apiWeiboAdd(form, function(r) {
      // 收到返回的数据, 插入到页面中
      var weibo = JSON.parse(r)
      insertWeibo(weibo)
    })
  })
}

var bindEventWeiboDelete = function() {
  var weiboList = e('#id-weibo-list')
  // 事件响应函数会传入一个参数 就是事件本身
  weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-delete')) {
      log('点到了删除按钮')
      weiboId = self.parentElement.dataset['id']
      apiWeiboDelete(weiboId, function(response) {
        var r = JSON.parse(response)
        log('apiWeiboDelete', r.message)
        // 删除 self 的父节点
        self.parentElement.remove()
      })
    } else {
      log('点到了 weibo cell')
    }
  })
}

var bindEventWeiboEdit = function() {
  var weiboList = e('#id-weibo-list')
  // 事件响应函数会传入一个参数 就是事件本身
  weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-edit')) {
      log('点到了编辑按钮')
      weiboCell = self.closest('.weibo-cell')
      weiboId = weiboCell.dataset['id']
      var weiboSpan = weiboCell.querySelector('.weibo-content')
      var content = weiboSpan.innerText
      // 插入编辑输入框
      insertUpdateForm(content, weiboCell)
    } else {
      log('点到了 weibo cell')
    }
  })
}

var bindEventWeiboUpdate = function() {
  var weiboList = e('#id-weibo-list')
  // 事件响应函数会传入一个参数 就是事件本身
  weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-update')) {
      log('点到了更新按钮')
      weiboCell = self.closest('.weibo-cell')
      weiboId = weiboCell.dataset['id']
      log('update weibo id', weiboId)
      input = weiboCell.querySelector('.weibo-update-input')
      content = input.value
      var form = {
        id: weiboId,
        content: content
      }

      apiWeiboUpdate(form, function(r) {
        // 收到返回的数据, 插入到页面中
        var weibo = JSON.parse(r)
        log('apiWeiboUpdate', weibo)

        var weiboSpan = weiboCell.querySelector('.weibo-content')
        weiboSpan.innerText = weibo.content

        var updateForm = weiboCell.querySelector('.weibo-update-form')
        updateForm.remove()
      })
    } else {
      log('点到了 weibo cell')
    }
  })
}

var bindEventCommentAdd = function() {
  var weiboList = e('#id-weibo-list')
  // 注意, 第二个参数可以直接给出定义函数
  weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-addComment')) {
      log('点到了添加评论按钮')
      weiboCell = self.closest('.weibo-cell')
      weiboId = weiboCell.dataset['id']
      var input = weiboCell.querySelector('.weibo-commentContent')
      var content = input.value

      log('click add', content)
      var form = {
        content: content,
        weibo_id: weiboId
      }
      apiCommentAdd(form, function(r) {

        var comment = JSON.parse(r)
        log('1111111111', comment)
        // commentContent = comment.content
        insertComment(comment, weiboCell)
      })

    } else {
      log('点到了 weibo cell')
    }
  })
}

var bindEventCommentDelete = function() {
  var weiboList = e('#id-weibo-list')
  // 注意, 第二个参数可以直接给出定义函数
  weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('comment-delete')) {
      log('点到了删除评论按钮')
      commentId = self.parentElement.dataset['id']
      apiCommentDelete(commentId, function(response) {
        var r = JSON.parse(response)
        log('apiCommentDelete', r.message)
        // 删除 self 的父节点
        self.parentElement.remove()
      })

    } else {
      log('点到了 weibo cell')
    }
  })
}

var bindEventCommentEdit = function() {
  var weiboList = e('#id-weibo-list')
  // 事件响应函数会传入一个参数 就是事件本身
  weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('comment-edit')) {
      log('点到了编辑评论按钮')
      commentCell = self.closest('.comment-cell')
      commentId = commentCell.dataset['id']
      var commentSpan = commentCell.querySelector('.comment-content')
      var content = commentSpan.innerText
      insertUpdateCommentForm(content, commentCell)

    } else {
      log('点到了 weibo cell')
    }
  })
}

var bindEventCommentUpdate = function() {
  var weiboList = e('#id-weibo-list')
  // 事件响应函数会传入一个参数 就是事件本身
  weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('comment-update')) {
      log('点到了更新评论按钮')

      commentCell = self.closest('.comment-cell')
      commentId = commentCell.dataset['id']
      input = commentCell.querySelector('.comment-update-input')
      content = input.value
      var form = {
        id: commentId,
        content: content
      }

      apiCommentUpdate(form, function(r) {
        var comment = JSON.parse(r)
        log('apiCommentUpdate', comment)

        var commentSpan = commentCell.querySelector('.comment-content')
        commentSpan.innerText = comment.content

        var updateForm = commentCell.querySelector('.comment-update-form')
        updateForm.remove()
      })

    } else {
      log('点到了 weibo cell')
    }
  })
}

var bindEvents = function() {
  bindEventWeiboAdd()
  bindEventWeiboDelete()
  bindEventWeiboEdit()
  bindEventWeiboUpdate()
  bindEventCommentAdd()
  bindEventCommentDelete()
  bindEventCommentEdit()
  bindEventCommentUpdate()
}

var __main = function() {
  bindEvents()
  loadWeibos()
}

__main()
