# Cardiologist — Landing Concepts

Three desktop/mobile visual directions presented in an HTML gallery.

[Open gallery](https://memorim.github.io/cardiologist-landing-designs/)

![Desktop composition](assets/01-01_focus_desktop.png)

<img src="assets/01-01_focus_mobile.png" width="320" alt="Mobile composition">

## Implementation

HTML/CSS gallery with PNG previews and editable SVG assets. The gallery can be served directly; no application build or secret configuration is needed. Desktop and mobile compositions are separate assets.

## Local setup and checks

```bash
python tests/check_assets.py
python .github/scripts/check_docs.py
python -m http.server 8080 --bind 127.0.0.1
```

Use Python 3.12.14, matching CI. Open `http://localhost:8080`. CI checks asset references and documentation; it does not certify interactive behavior inside images.

## Scope and limits

A design gallery, not a medical appointment application. Controls inside preview images are not working forms.

No database, migrations or API are required for this static scope. Forms or integrations would be a separate implementation task.

[Technical details](docs/TECHNICAL.md) · [Recorded checks](docs/VERIFICATION.md) · [Change history](CHANGELOG.md)
