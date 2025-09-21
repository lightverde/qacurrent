from fastapi import FastAPI, Body
from pydantic import BaseModel
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs
import requests

app = FastAPI(title="Email QA Agent")

# Require these UTM params & values (tweak as needed)
UTM_REQUIRED = {"utm_source": "email", "utm_medium": "braze-mktg"}

def extract_links(html: str):
    soup = BeautifulSoup(html, "html.parser")
    return [a.get("href") for a in soup.find_all("a") if a.get("href")]

def link_check(url: str):
    try:
        r = requests.head(url, allow_redirects=True, timeout=5)
        return ("PASS" if r.status_code < 400 else "FAIL", {"status": r.status_code})
    except Exception as e:
        return ("FAIL", {"error": str(e)})

def utm_check(url: str):
    q = parse_qs(urlparse(url).query)
    missing = [k for k, v in UTM_REQUIRED.items() if q.get(k, [None])[0] != v]
    return ("PASS", {}) if not missing else ("WARN", {"missing_or_mismatch": missing})

class QARequest(BaseModel):
    message_id: str | None = "ad-hoc"
    html: str

@app.post("/actions/qa_message")
def qa_message(payload: QARequest = Body(...)):
    html = payload.html
    findings = []

    # Liquid balance
    o, c = html.count("{{"), html.count("}}")
    ot, ct = html.count("{%"), html.count("%}")
    findings.append({
        "check_name": "liquid_syntax",
        "status": "PASS" if (o == c and ot == ct) else "FAIL",
        "details": {"unbalanced": not (o == c and ot == ct)}
    })

    # Links + UTM
    for u in extract_links(html):
        s1, d1 = link_check(u)
        findings.append({"check_name": "broken_link", "status": s1, "details": {"url": u, **d1}})
        s2, d2 = utm_check(u)
        findings.append({"check_name": "utm", "status": s2, "details": {"url": u, **d2}})

    overall = "FAIL" if any(f["status"] == "FAIL" for f in findings) else \
              ("WARN" if any(f["status"] == "WARN" for f in findings) else "PASS")
    return {"overall": overall, "findings": findings}