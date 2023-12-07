import sys

from flask import make_response, jsonify
 
errorStatusList = [{'status_code':400,'msg':'Bad Request'},
    {'status_code':401,'msg':'Unauthorized'},
    {'status_code':402,'msg':'Payment Required'},
    {'status_code':403,'msg':'Forbidden'},
    {'status_code':404,'msg':'Page Not Found'},
    {'status_code':500,'msg':'Unexpected Error'},
    {'status_code':503,'msg':'Service Unavailable'}]

class errorStatus():
    def msgFeedback(self, msg, code=200,):
        return make_response(jsonify({'msg': msg, 'status_code':code}),code)

    def statusCode(self, msg, code=200,):
        return make_response(jsonify({'msg': msg,'payload': None, 'status_code':code}),code)

    def statusDefault(self,errNum):
        return make_response(jsonify(errorStatusList[errNum]),errorStatusList[errNum]["status_code"])

    def errDB(self,*arg,**kwargs):
        return 