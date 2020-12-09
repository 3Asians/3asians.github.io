import requests 
from bs4 import BeautifulSoup 
from selenium import webdriver 
from selenium.webdriver.common.keys import Keys 
from webdriver_manager.chrome import ChromeDriverManager
from time import sleep
import json

def fetch_html(url):
    """
    fetch html
    """
    with webdriver.Chrome(ChromeDriverManager().install()) as driver:
        driver.get(url)
        driver.set_window_size(1700,980)
        sleep(5)
        html = driver.page_source 
    return BeautifulSoup(html, "html.parser") 

def RWS(text: str):
    """
    removes weird shit like spaces and newlines
    """
    return ' '.join(text.split())

"""

# PITAN.IS
pitan_soup = fetch_html('https://www.pitan.is/#/')

pitan_groups = [
    pitan_soup.find(id='g_0').find_all(class_='t-item-card'),
    pitan_soup.find(id='g_1').find_all(class_='t-item-card')
]

with open('menu.json', 'r+', encoding='utf-8') as f:
    menu = json.load(f)
    menu[0]['RestaurantMenu'] = []
    
    for group in pitan_groups:
        for i in group:
            menu[0]['RestaurantMenu'].append({
                "img":   i.find(class_='t-item-img').find('img')['src'],
                "name":  RWS(i.find(class_='t-item-body').find(class_='t-item-name').find('span').text),
                "food":  i.find(class_='t-item-title').text,
                "price": i.find(class_='t-item-control-total').find('span').text
            })
    

    f.seek(0)        
    json.dump(menu, f, indent=4, ensure_ascii=False)
    f.truncate()     


# AMERICANSTYLE
americanstyle_soup = fetch_html('https://americanstyle.is/')

with open('menu.json', 'r+', encoding='utf-8') as f:
    menu = json.load(f)
    menu[1]['RestaurantMenu'] = americanstyle_soup.find('ul', class_='tenglar').find(class_='matsedill').find('a')['href']

    f.seek(0)
    json.dump(menu, f, indent=4, ensure_ascii=False)
    f.truncate()     


# PIZZAKING not dynamic at all 

with open('menu.json', 'r+', encoding='utf-8') as f:
    menu = json.load(f)
    menu[2]['RestaurantMenu'] = 'https://www.pizzaking.is/matsedill.php'

    f.seek(0)
    json.dump(menu, f, indent=4, ensure_ascii=False)
    f.truncate()  



# SUBWAY
subway_soup = fetch_html('https://subway.is/tilbod/')

with open('menu.json', 'r+', encoding='utf-8') as f:
    menu = json.load(f)
    menu[3]['RestaurantMenu'] = []

    for g in subway_soup.find('body').find_all('section', class_='container')[1].find('div', class_='wpb_wrapper').find_all(class_='vc_row wpb_row vc_inner vc_row-fluid'):
        for i in g.find_all(class_='wpb_column vc_column_container vc_col-sm-4'):
            s = i.find(class_='wpb_wrapper')
            
            menu[3]['RestaurantMenu'].append({
                "img":   str(i.find('img'))[116:-1].split('"')[0],
                "name":  s.find(class_='vc_custom_heading').text,
                "food":  s.find(class_='wpb_text_column wpb_content_element').find('p').text,
                "price": str(i.find('h4'))[10:-5]
            })

    print(menu[3]['RestaurantMenu'])
        

    f.seek(0)
    json.dump(menu, f, indent=4, ensure_ascii=False)
    f.truncate()     


# DOMINOS
dominos_soup = fetch_html('https://dominos.is/panta/tilbod/')

with open('menu.json', 'r+', encoding='utf-8') as f:
    menu = json.load(f)
    menu[4]['RestaurantMenu'] = []

    for i in dominos_soup.find('ul', class_='OffersRoute__grid').find_all('a'):
        menu[4]['RestaurantMenu'].append({
            "img":   menu[4]['RestaurantSite'] + i.picture.img['src'],
            "name":  i.h2.text,
            "food":  i.p.text,
            "price": i.text.split('a')[-1][0:-1]
        })

    for i in menu[4]['RestaurantMenu']:
        if i['name'] == 'Tvennutilboð':
            i['price'] = 'verð fer eftir'

    f.seek(0)
    json.dump(menu, f, indent=4, ensure_ascii=False)
    f.truncate()     

"""


""" website not scrapeable
# DEVITOS PIZZA
devit_soup = fetch_html('https://devitos.is/specials')

with open('menu.json', 'r+', encoding='utf-8') as f:
    menu = json.load(f)
    menu[5]['RestaurantMenu'] = []

    for i in devit_soup:
        menu[5]['RestaurantMenu'].append({
            "img":   None,
            "name":  None,
            "food":  None,
            "price": i['price'] = 'verð fer eftir'
        })        

    f.seek(0)
    json.dump(menu, f, indent=4, ensure_ascii=False)
    f.truncate()     

"""

# NOODLE STATION
noodle_soup = fetch_html('https://noodlestation.is/')

with open('menu.json', 'r+', encoding='utf-8') as f:
    menu = json.load(f)
    menu[6]['RestaurantMenu'] = []

    for i in noodle_soup.find_all(class_='vc_col-sm-12 wpb_column column_container  jupiter-donut- _ jupiter-donut-height-full'):
        print(i)
        
        menu[6]['RestaurantMenu'].append({
            "img":   None,
            "name":  None,
            "food":  None,
            "price": None
        })        

    f.seek(0)
    json.dump(menu, f, indent=4, ensure_ascii=False)
    f.truncate()    