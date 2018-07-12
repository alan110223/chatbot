import sys
print(sys.getdefaultencoding())
s='撣喳'
d=s.encode('utf-8')
print(d)
print(d.decode('big5'))

