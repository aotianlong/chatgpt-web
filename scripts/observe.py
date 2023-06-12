# 写一个检测 https://mchat.mbmzone.com的脚本
# 使用requests检测， 如果发现返回的status_code不为200,则运行 systemctl restart mchat

import requests
import os

def check():
  r = requests.get('https://mchat.mbmzone.com')
  if r.status_code != 200:
    print('restart mchat')
    os.system('systemctl restart mchat')
  else:
    print('mchat is ok')

if __name__ == '__main__':
  check()
