from urllib.parse import urlparse, parse_qs
import feedparser
import bs4 as bs
import urllib.request
import re
import json

def get_contents(url):
    pattern = re.compile(r"^<!--(.*?)-->$|document\.get|window\.adsbygoogle")
    req = urllib.request.Request(url, data=None, headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
    })
    sauce = urllib.request.urlopen(req).read()
    soup = bs.BeautifulSoup(sauce)

    title = soup.title.string
    paragraphs = []
    for paragraph in soup.find_all('p'):
        p_text = paragraph.text
        p_text = p_text.replace('\n', '')
        p_text = p_text.replace('\r', '')

        if (not pattern.match(p_text) and len(p_text) > 20):
            paragraphs.append(p_text)

    return {
        'title': title,
        'paragraphs': paragraphs
    }


def lambda_handler(event, context):
    print(event['queryStringParameters']['q'])
    q = event['queryStringParameters']['q'].replace(' ', '+')
    print("Query: {}".format(q))
    url = "http://news.google.com/news?q={}&output=rss".format(q)

    d = feedparser.parse(url)

    out = []
    print("ITEM COUNT: {}".format(len(d.entries)))

    for item in d.entries:
        parsed = urlparse(item.link)
        qs = parse_qs(parsed.query)
        link = qs['url'][0];
        post = {
            'published': item.published,
            'link': link,
            'contents': get_contents(link)
        }
        out.append(post)

    output = json.dumps(out)
    print(out)
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': output
    }

if __name__ == '__main__':
    event = {
        'queryStringParameters': {
            'q': 'Biostage'
        }
    }
    lambda_handler(event, None)
