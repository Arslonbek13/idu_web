from django.utils.translation import get_language

from .models import Category, News

UI_COPY = {
    'en': {
        'go': 'Go',
        'latest_news': 'Latest News',
        'tagline': 'Daily reporting across local, world, technology, and sport.',
        'search_news': 'Search news',
        'footer_desc': 'Daily reporting on the stories shaping Uzbekistan and the wider world.',
        'open_contact_page': 'Open contact page',
        'developed_by': 'Developed by Arslonbek',
        'explore_section': 'Explore section',
        'browse_news': 'Browse news',
        'local_intro': 'Daily coverage from communities, cities, and regions.',
        'world_intro': 'Global developments, diplomacy, and major international headlines.',
        'technology_intro': 'Product launches, innovation, digital tools, and industry analysis.',
        'sport_intro': 'Matches, athletes, tournaments, and standout performances.',
        'empty_section': 'There are no published stories in this section yet.',
        'contact_intro': 'Use the form below to send feedback, partnership requests, or editorial questions.',
        'name': 'Name',
        'email': 'Email',
        'message': 'Message',
        'send_message': 'Send Message',
        'go_home': 'Go to home page',
        'no_search_results': 'There are no published stories matching your search yet.',
    },
    'uz': {
        'go': "O'tish",
        'latest_news': 'So‘nggi Yangiliklar',
        'tagline': 'Mahalliy, dunyo, texnologiya va sport yangiliklari har kuni yoritiladi.',
        'search_news': 'Yangiliklarni qidirish',
        'footer_desc': "O'zbekiston va butun dunyodagi muhim voqealarni har kuni yoritamiz.",
        'open_contact_page': "Bog'lanish sahifasini ochish",
        'developed_by': 'Arslonbek tomonidan ishlab chiqilgan',
        'explore_section': "Bo'limni ko'rish",
        'browse_news': "Yangiliklarni ko'rish",
        'local_intro': 'Hududlar, shaharlar va jamoalardagi voqealar har kuni yoritiladi.',
        'world_intro': 'Global voqealar, diplomatiya va muhim xalqaro yangiliklar.',
        'technology_intro': 'Yangi mahsulotlar, innovatsiyalar, raqamli vositalar va soha tahlillari.',
        'sport_intro': 'Uchrashuvlar, sportchilar, turnirlar va yorqin natijalar.',
        'empty_section': "Bu bo'limda hali chop etilgan materiallar yo'q.",
        'contact_intro': "Fikr-mulohaza, hamkorlik so'rovi yoki tahririyat savollarini yuborish uchun quyidagi formadan foydalaning.",
        'name': 'Ism',
        'email': 'Email',
        'message': 'Xabar',
        'send_message': 'Xabar yuborish',
        'go_home': "Bosh sahifaga o'tish",
        'no_search_results': "Qidiruvingizga mos chop etilgan materiallar hali topilmadi.",
    },
    'ru': {
        'go': 'Перейти',
        'latest_news': 'Последние Новости',
        'tagline': 'Ежедневные новости о местных событиях, мире, технологиях и спорте.',
        'search_news': 'Поиск новостей',
        'footer_desc': 'Ежедневно рассказываем о событиях, которые формируют Узбекистан и весь мир.',
        'open_contact_page': 'Открыть страницу контактов',
        'developed_by': 'Разработано Арслонбеком',
        'explore_section': 'Перейти в раздел',
        'browse_news': 'Смотреть новости',
        'local_intro': 'Ежедневные материалы из сообществ, городов и регионов.',
        'world_intro': 'Глобальные события, дипломатия и главные международные новости.',
        'technology_intro': 'Запуски продуктов, инновации, цифровые инструменты и аналитика отрасли.',
        'sport_intro': 'Матчи, спортсмены, турниры и яркие выступления.',
        'empty_section': 'В этом разделе пока нет опубликованных материалов.',
        'contact_intro': 'Используйте форму ниже, чтобы отправить отзыв, запрос на сотрудничество или вопрос редакции.',
        'name': 'Имя',
        'email': 'Email',
        'message': 'Сообщение',
        'send_message': 'Отправить сообщение',
        'go_home': 'Перейти на главную',
        'no_search_results': 'Пока нет опубликованных материалов, соответствующих вашему запросу.',
    },
}

def latest_news(_request):
    news_items = News.published.all().order_by('-publish_time')[:10]
    sidebar_news = news_items[:4]
    categories = Category.objects.all()
    language_code = (get_language() or 'en')[:2]

    context = {
        'latest_news': news_items,
        'sidebar_news': sidebar_news,
        'categories': categories,
        'ui_text': UI_COPY.get(language_code, UI_COPY['en']),
    }
    return context
