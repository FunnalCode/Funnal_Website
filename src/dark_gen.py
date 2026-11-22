"""Builds dark.css from style.css: every rule that paints a light surface, a light border or dark text gets a dark-mode twin
under html[data-hc-theme=dark]. Hues are kept, so the coloured accents still read as the same colours at night."""
import re, colorsys

css = open('style.css').read()
css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)

def hex2rgb(h):
    h = h.lstrip('#')
    if len(h) in (3, 4): h = ''.join(c*2 for c in h[:3])
    return tuple(int(h[i:i+2], 16)/255 for i in (0, 2, 4))

def rgb2hex(r, g, b):
    return '#%02X%02X%02X' % tuple(max(0, min(255, round(v*255))) for v in (r, g, b))

def lum(r, g, b):
    return .2126*r + .7152*g + .0722*b

def surface(rgb, a=1):
    """Light surfaces become the navy family. Clearly tinted ones (mint, sky, rose, lilac) keep their hue as a dark tint,
    so a green success box is still green at night. Creams and parchments join the navy, so nothing turns muddy brown."""
    h, l, s = colorsys.rgb_to_hls(*rgb)
    hd = h * 360
    nl = max(.12, min(.22, .11 + (l - .85) * .6))
    if s > .35 and not (25 <= hd <= 62) and l < .975:
        return colorsys.hls_to_rgb(h, .2, .3)
    return colorsys.hls_to_rgb(215/360, nl, .3)

def border(rgb):
    h, l, s = colorsys.rgb_to_hls(*rgb)
    if s > .35 and not (25 <= h*360 <= 62):
        return colorsys.hls_to_rgb(h, .32, .3)
    return colorsys.hls_to_rgb(215/360, .26, .22)

def text(rgb):
    h, l, s = colorsys.rgb_to_hls(*rgb)
    return colorsys.hls_to_rgb(h, .86 if l < .25 else .8, min(s, .5) * .45)

COL = re.compile(r'#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b|rgba?\([^)]*\)')

def parse_col(tok):
    if tok.startswith('#'):
        return hex2rgb(tok), 1
    nums = [float(x) for x in re.findall(r'[\d.]+', tok)]
    if len(nums) < 3: return None, None
    return (nums[0]/255, nums[1]/255, nums[2]/255), (nums[3] if len(nums) > 3 else 1)

def fmt(rgb, a):
    if a >= 1: return rgb2hex(*rgb)
    r, g, b = (round(v*255) for v in rgb)
    return f'rgba({r},{g},{b},{a})'

def map_value(val, kind):
    changed = False
    def rep(m):
        nonlocal changed
        tok = m.group(0)
        rgb, a = parse_col(tok)
        if rgb is None: return tok
        L = lum(*rgb)
        if kind == 'bg' and L > .72 and a > .3:
            changed = True; return fmt(surface(rgb), a)
        if kind == 'border' and L > .72:
            changed = True; return fmt(border(rgb), a)
        if kind == 'text' and L < .4 and a > .3:
            changed = True; return fmt(text(rgb), a)
        if kind == 'shadow' and L > .55 and a > .2:
            changed = True; return fmt((.06, .08, .09), min(a, .5))
        return tok
    out = COL.sub(rep, val)
    return out, changed

def kind_of(prop):
    if prop in ('background', 'background-color', 'background-image'): return 'bg'
    if prop.startswith('border') or prop.startswith('outline'): return 'border'
    if prop in ('color', 'fill', '-webkit-text-fill-color', 'caret-color'): return 'text'
    if prop in ('box-shadow', 'text-shadow'): return 'shadow'
    return None

SKIP = ('.pillInd', '.pIni', '.pBanner', '.pBanIco', '.pTag', '.pRag', '.pDue', '.pRevNote', '.pStTag', '.bounty', '.qRing', '.qRew', '.qStamp', '.qLeft', '.qBoard', '.qChart', '.evHero', '.evTxt', '.evCount', '.advCal', '.advDoor', '.advGrid', '.advNudge', '.flyCoin', '.paper', '.hIllo', '.heraldCard', '.hMast', '.hStamp', '.tvMenu', '.mItem', '.mHead', '.mNote', '.mFoot', '.mTxt', '.jukebox', '.jb', '#focus', '.fTop', '.fStat', '#catchFx', '.bmCard', '.bmShut', '#tip', '.dmBtn', '#dm', '.lvlBadge', 'canvas', '.okTag', '.rtag', '.r-', '.appIco', '#intro', '.splash', '.gate')

def prefix(sel):
    out = []
    for s in sel.split(','):
        s = s.strip()
        if not s: continue
        if s.startswith(':root') or s.startswith('html'): out.append('html[data-hc-theme=dark]' + s.replace(':root', '').replace('html', '', 1))
        elif s.startswith('body'): out.append('html[data-hc-theme=dark] ' + s)
        else: out.append('html[data-hc-theme=dark] ' + s)
    return ','.join(out)

def walk(block, media=None, out=None):
    i = 0
    while i < len(block):
        j = block.find('{', i)
        if j < 0: break
        head = block[i:j].strip()
        # find the matching brace
        depth, k = 1, j + 1
        while k < len(block) and depth:
            if block[k] == '{': depth += 1
            elif block[k] == '}': depth -= 1
            k += 1
        body = block[j+1:k-1]
        if head.startswith('@media') or head.startswith('@supports'):
            walk(body, head, out)
        elif head.startswith('@'):
            pass
        elif head and not any(x in head for x in SKIP):
            decls = []
            has_bg = None
            for d in body.split(';'):
                if ':' not in d: continue
                p, v = d.split(':', 1); p = p.strip().lower(); v = v.strip()
                if kind_of(p) == 'bg': has_bg = v
            for d in body.split(';'):
                if ':' not in d: continue
                p, v = d.split(':', 1); p = p.strip().lower(); v = v.strip()
                k2 = kind_of(p)
                if not k2: continue
                if k2 == 'text' and has_bg:
                    # only flip dark text when the rule's own background is light (and so is being darkened too)
                    toks = [parse_col(t)[0] for t in COL.findall(has_bg)]
                    toks = [t for t in toks if t]
                    if toks and min(lum(*t) for t in toks) < .6: continue
                if k2 == 'bg' and 'gradient' in v and ('var(' in v or any(parse_col(t)[0] and lum(*parse_col(t)[0]) <= .72 for t in COL.findall(v))):
                    continue
                nv, ch = map_value(v, k2)
                if ch: decls.append(f'{p}:{nv}')
            if decls:
                rule = f'{prefix(head)}{{{";".join(decls)}}}'
                out.append(f'{media}{{{rule}}}' if media else rule)
        i = k
    return out

rules = walk(css, None, [])
VARS = open('dark_fix.css').read()

open('dark.css', 'w').write('/* generated by dark_gen.py: dark mode */\n' + '\n'.join(rules) + '\n' + VARS)
print(len(rules), 'dark rules')
