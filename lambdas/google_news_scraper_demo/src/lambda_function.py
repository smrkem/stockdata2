import json
import urllib.request
from urllib.parse import urlparse, parse_qs
import feedparser
import bs4 as bs
import re
import boto3


s3 = boto3.resource('s3')
bucket = s3.Bucket('ms-stockknewsitems-demo')


def sanitize_content(text):
    """
    ToDO:
    This site uses cookies. By continuing to browse the site you are agreeing to our use of cookies.

    A cookie is a piece of data stored by your browser or device that helps websites like this one recognize return visitors. We use cookies to give you the best experience on BNA.com. Some cookies are also necessary for the technical operation of our website. If you continue browsing, you agree to this site’s use of cookies.
    """
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
    try:
        req = urllib.request.Request(url, data=None, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
        })

        sauce = urllib.request.urlopen(req).read()
        soup = bs.BeautifulSoup(sauce, "html.parser")
    except:
        return False

    for paragraph in soup.find_all('p'):
        sanitized = sanitize_content(paragraph.text)
        if len(sanitized) > 20:
            out.append(sanitized)

    return out


def fetch_posts(q, previous_urls):
    url = "http://news.google.com/news?q={}&output=rss".format(q)
    d = feedparser.parse(url)
    out = []
    for item in d.entries:
        qs = parse_qs(urlparse(item.link).query)
        link = qs['url'][0]
        if link not in previous_urls:
            contents = grab_contents(link)
            if contents:
                out.append({
                    'title': item.title,
                    'published': item.published,
                    'link': link,
                    'contents': contents
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


def get_meta():
    obj = bucket.Object('stocknews.meta.json')
    meta = json.loads(obj.get()['Body'].read())
    return meta


def lambda_handler(event, context):
    q = event['queryStringParameters']['q'].replace(' ', '+')
    print("Query: {}".format(q))

    meta = get_meta()
    posts = fetch_posts(q, [])
    print("ITEM COUNT: {}".format(len(posts)))

    output = {
        'message': "Got query: {}".format(q),
        'meta': {
            'current_good_posts': meta['current_good_posts'],
            'current_spam_posts': meta['current_spam_posts'],
            'total_urls': len(meta['url_history'])
        },
        'posts': posts
    }
    return generate_response(output)

if __name__ == "__main__":
    event = { 'queryStringParameters': {
            'q': 'gliead sciences'
        }
    }
    lambda_handler(event, None)
