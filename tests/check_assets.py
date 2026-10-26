from html.parser import HTMLParser
from pathlib import Path
from struct import unpack
root=Path(__file__).resolve().parents[1]
class Assets(HTMLParser):
    def handle_starttag(self,tag,attrs):
        if tag=="img":
            attrs=dict(attrs)
            src=attrs["src"]
            assert attrs.get("alt", "").strip(), "Missing image description"
            with (root/src).open("rb") as image:
                header=image.read(24)
            assert header.startswith(b"\x89PNG\r\n\x1a\n"), src
            natural=unpack(">II",header[16:24])
            assert (int(attrs.get("width",0)),int(attrs.get("height",0)))==natural, src
            assert (root/src).is_file(),src
parser=Assets()
parser.feed((root/"index.html").read_text(encoding="utf-8"))
assert (root/"README.md").exists()
assert len(list((root/"assets").glob("*.png")))>=2
print("Gallery assets and README: OK")
