import re,html,sys
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.out=[]; s.depth=0; s.skip=0; s.buf=''
    def flush(s):
        t=re.sub(r'\s+',' ',s.buf).strip()
        if t: s.out.append('  '*s.depth+t)
        s.buf=''
    def handle_starttag(s,tag,a):
        if tag in('script','style','noscript','svg'): s.skip+=1
        if tag in('ul','ol'): s.flush(); s.depth+=1
        elif tag in('li','p','h1','h2','h3','h4','h5','div','br','tr','summary','details'): s.flush()
        if tag in('h1','h2','h3','h4','h5'): s.buf+='## '
        if tag=='li': s.buf+='- '
    def handle_endtag(s,tag):
        if tag in('script','style','noscript','svg'): s.skip-=1
        if tag in('ul','ol'): s.flush(); s.depth-=1
        elif tag in('li','p','h1','h2','h3','h4','h5','div','tr','summary','details'): s.flush()
    def handle_data(s,d):
        if not s.skip: s.buf+=d
src,dst=sys.argv[1],sys.argv[2]
s=open(src,encoding='utf-8').read()
m=re.search(r'<body.*</body>',s,re.S)
p=P(); p.feed(m.group(0) if m else s); p.flush()
open(dst,'w',encoding='utf-8').write('\n'.join(p.out))
