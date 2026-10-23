from html.parser import HTMLParser
from pathlib import Path
root=Path(__file__).resolve().parents[1]
class Assets(HTMLParser):
    def handle_starttag(self,tag,attrs):
        if tag=="img":
            src=dict(attrs)["src"]
            assert (root/src).is_file(),src
parser=Assets()
parser.feed((root/"index.html").read_text(encoding="utf-8"))
assert (root/"README.md").exists()
assert len(list((root/"assets").glob("*.png")))>=2
print("Gallery assets and README: OK")
