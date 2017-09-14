import json
import urllib.request
from urllib.parse import urlparse, parse_qs
import feedparser
import bs4 as bs
import re


def sanitize_content(text):
    bad_patterns = [
        r"^<!--(.*?)-->$",
        r"^.*document\.get.*$",
        r"^.*adsbygoogle.*$",
    ]
    regexes = []
    for pattern in bad_patterns:
        regexes.append(re.compile(pattern))

    out = text.replace('\n', '')
    out = out.replace('\r', '')
    for pattern in regexes:
        if pattern.match(out):
            return ""
    return out


def grab_contents(url):
    out = []
    req = urllib.request.Request(url, data=None, headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
    })

    sauce = urllib.request.urlopen(req).read()
    soup = bs.BeautifulSoup(sauce, "html.parser")
    for h_type in ['h2', 'h3', 'h4']:
        for heading in soup.find_all(h_type):
            sanitized = sanitize_content(heading.text)
            if len(sanitized) > 5:
                out.append(sanitized)

    for paragraph in soup.find_all('p'):
        sanitized = sanitize_content(paragraph.text)
        if len(sanitized) > 20:
            out.append(sanitized)

    return out


def fetch_posts(q):
    url = "http://news.google.com/news?q={}&output=rss".format(q)
    d = feedparser.parse(url)
    out = []
    for item in d.entries:
        qs = parse_qs(urlparse(item.link).query)
        link = qs['url'][0]
        out.append({
            'title': item.title,
            'published': item.published,
            'link': link,
            'contents': grab_contents(link)
        })
    return out


def generate_response(body, status=200):
    return {
        'statusCode': status,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body)
    }


def lambda_handler(event, context):
    q = event['queryStringParameters']['q'].replace(' ', '+')
    print("Query: {}".format(q))

    posts = fetch_posts(q)
    print("ITEM COUNT: {}".format(len(posts)))

    output = {
        'message': "Got query: {}".format(q),
        'posts': posts
    }
    return generate_response(output)

if __name__ == "__main__":
    event = { 'queryStringParameters': {
            'q': 'biostage'
        }
    }
    lambda_handler(event, None)
