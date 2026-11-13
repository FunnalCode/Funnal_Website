#!/usr/bin/env python3
"""Hundred Cannons pet sighting email helper.
  prep.py week         -> prints this week's remaining working-day sighting times (ISO, Europe/London) one per line
  prep.py mail [DATE]  -> writes /tmp/mail.json for DATE (default today) and prints SEND or SKIP <reason>"""
import sys,json,random,hashlib,datetime,os,urllib.request
from zoneinfo import ZoneInfo
UK=ZoneInfo('Europe/London');HERE=os.path.dirname(os.path.abspath(__file__))
KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eWNybWdzenpiZmx0ZmV2ZWVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MDkzMjgsImV4cCI6MjExMDA4NTMyOH0.9_mjAs6dWeukzBX5wqABBXlGFDO3yUjpRCiorVyJoVg'
def h32(s):
    h=2166136261
    for ch in s.encode('utf-16-le')[::2]: h^=ch; h=(h*16777619)&0xffffffff
    h^=h>>13; h=(h*0x5bd1e995)&0xffffffff; h^=h>>15; return h
def sighting(D):
    x=h32(D+'rar')%100;rar='common'
    for k,w in [('common',45),('uncommon',27),('rare',15),('epic',8),('legendary',4),('mythic',1)]:
        if x<w: rar=k;break
        x-=w
    NEW={'common':(5,30),'uncommon':(8,30),'rare':(14,35),'epic':(22,40),'legendary':(35,45),'mythic':(50,45)}
    OLD={'common':(3,30),'uncommon':(4,25),'rare':(5,20),'epic':(6,15),'legendary':(7,10),'mythic':(8,5)}
    need,win=(NEW if D>='2026-11-14' else OLD)[rar];sm=420+h32(D+'sight')%(720-win)
    f=lambda m:'%02d:%02d'%(m//60,m%60);return rar,need,win,f(sm),f(sm+win)
def workday(D):
    try:
        r=urllib.request.Request('https://uyycrmgszzbfltfeveen.supabase.co/rest/v1/rpc/hl_is_workday',data=json.dumps({'d':D}).encode(),headers={'apikey':KEY,'Authorization':'Bearer '+KEY,'Content-Type':'application/json'})
        return urllib.request.urlopen(r,timeout=10).read().decode().strip()!='false'
    except Exception: return True
cmd=sys.argv[1] if len(sys.argv)>1 else 'mail'
if cmd=='week':
    now=datetime.datetime.now(UK);d=now.date()
    for i in range(7):
        day=d+datetime.timedelta(days=i);D=day.isoformat()
        if i and day.weekday()==0: break
        st=sighting(D)[3];t=datetime.datetime.fromisoformat(D+'T'+st).replace(tzinfo=UK)
        if t>now and workday(D): print(D+'T'+st+':00[Europe/London]')
    sys.exit()
D=sys.argv[2] if len(sys.argv)>2 else datetime.datetime.now(UK).date().isoformat()
if not workday(D): print('SKIP day off');sys.exit()
rar,need,win,st,en=sighting(D)
C={'common':('#7D8894','small and slightly suspicious'),'uncommon':('#2F8F62','unusual'),'rare':('#2A6FBF','properly rare'),'epic':('#7440C4','epic'),'legendary':('#C07E0C','legendary'),'mythic':('#B92A62','mythic, which almost never happens,')}[rar]
joke=random.choice(['Gary saw it first and has not stopped talking about it.','It looked at the lighthouse like it owns the place.','The parrot is already jealous.','It has not signed any paperwork yet.','Please do not tell it about the cannons.','Finders keepers is legally binding at sea.'])
html=open(os.path.join(HERE,'template.html')).read().strip()
for a,b in [('COLOUR',C[0]),('RARITY',rar),('PHRASE',C[1]),('NEED',str(need)),('WINDOW',str(win)),('START',st),('END',en),('JOKE',joke)]: html=html.replace(a,b)
img=os.path.join(HERE,'pet-%s.jpg'%rar);hx=hashlib.sha256(open(img,'rb').read()).hexdigest()
json.dump({'to':['sam@funnal.co.uk','james@funnal.co.uk'],'subject':'Pet sighting now: %s pet, %d DMs by %s'%(rar.capitalize(),need,en),
  'body':'A %s pet is in Funnal Cove right now. Log %d DMs in Hundred Cannons by %s UK time to claim it. Board the ship: https://funnal.co.uk/crew  -- Gary the gull'%(rar,need,en),
  'htmlBody':html,'attachments':[{'filename':'pet-sighting.jpg','mimeType':'image/jpeg','inline':True,'content':'sha256:%s:%s'%(hx,img)}]},open('/tmp/mail.json','w'))
print('SEND')
