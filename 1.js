var apiCommentUpdate = function(form, callback) {
  var path = '/api/weibo/comment_update'
  ajax('POST', path, form, callback)
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
