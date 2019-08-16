import flask
# сначал надо установить flask
# pip install flask
# если не сработает, то python -m pip install flask
# но можно вообще проект в пайчарме создать и он там сам все установит

# структура сервака такая:
# force\
#     -graph.json
#     -prog.html
# script.py

# запускать из этой папки скрипт. рабочая папка сервака это force он берет все файлики оттуда
# если запускаешь из консоли, то python script.py
# собственно программа работает по этому адрессу http://localhost:8000
# можешь менять файлики, сохранять и обновлять страницу
# иногда нужно тыкнуть в браузера во вкладке network disable cache, но это редко


app = flask.Flask(__name__, static_folder="force")

@app.route('/script.js') 
def script_js(): 
	return app.send_static_file('script.js')

@app.route('/json-viewer.js') 
def json_viewer(): 
	return app.send_static_file('json-viewer.js') 

@app.route('/json-viewer.css') 
def json_viewer_css(): 
	return app.send_static_file('json-viewer.css')

@app.route('/')
def static_proxy():
    return app.send_static_file("prog.html")

@app.route('/graph.json')
def graph_json():
    return app.send_static_file("graph.json")

print('\nGo to http://localhost:8000 to see the example\n')
try:
    app.run(port=8000)
except Exception as e:
    print(e)

