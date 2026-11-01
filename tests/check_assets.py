from html.parser import HTMLParser
from pathlib import Path
root = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'img':
            assert a.get('alt')
        if tag == 'form':
            assert a['action'].endswith('/api/appointments/focus') and a['method'] == 'post'
        for key in ('src','href'):
            url = a.get(key,'')
            if url and not url.startswith(('https://','#')):
                assert (root / url).is_file(), url
Page().feed((root/'index.html').read_text(encoding='utf8'))
