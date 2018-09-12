from utils import log
from routes import json_response, current_user
from models.weibo import Weibo
from models.comment import Comment


# 本文件只返回 json 格式的数据
# 而不是 html 格式的数据
def all(request):
    weibos = Weibo.all_json()
    for c in weibos:
        w = Weibo.find_by(id=c['id'])
        comments = [t.json() for t in w.comments()]
        c['comments'] = comments

    return json_response(weibos)


def add(request):
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    # 所以这里我们用新增加的 json 函数来获取格式化后的 json 数据
    form = request.json()
    # 创建一个 weibo
    u = current_user(request)
    t = Weibo(form)
    t.user_id = u.id
    t.save()
    # 把创建好的 weibo 返回给浏览器
    return json_response(t.json())


def delete(request):
    weibo_id = int(request.query['id'])
    w = Weibo.find_by(id=weibo_id)
    for c in w.comments():
        Comment.delete(c.id)
    Weibo.delete(weibo_id)
    d = dict(
        message="成功删除 weibo"
    )
    return json_response(d)


def update(request):
    """
    用于增加新 weibo 的路由函数
    """
    form = request.json()
    log('api weibo update form', form)
    t = Weibo.update(form)
    return json_response(t.json())


def comment_add(request):
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    # 所以这里我们用新增加的 json 函数来获取格式化后的 json 数据
    form = request.json()
    # 创建一个 comment
    u = current_user(request)
    c = Comment(form)
    c.user_id = u.id
    c.save()
    # 把创建好的 comment 返回给浏览器
    return json_response(c.json())


def comment_delete(request):
    comment_id = int(request.query['id'])
    Comment.delete(comment_id)
    d = dict(
        message="成功删除 comment"
    )
    return json_response(d)


def comment_update(request):
    form = request.json()
    log('api comment update form', form)
    c = Comment.update(form)
    return json_response(c.json())


def route_dict():
    d = {
        '/api/weibo/all': all,
        '/api/weibo/add': add,
        '/api/weibo/delete': delete,
        '/api/weibo/update': update,
        '/api/weibo/comment_add': comment_add,
        '/api/weibo/comment_delete': comment_delete,
        '/api/weibo/comment_update': comment_update,
    }
    return d
